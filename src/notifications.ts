import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import {Platform} from "react-native";
import {openChat} from "./navigation/utils";

function areNotificationsSupported(): boolean {
    return Constants.isDevice && Platform.OS !== "web";
}

export function configureNotifications(): void {
    if (!areNotificationsSupported()) return;

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });

    Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:");
        console.log(notification.request.content);
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:");
        const data = response.notification.request.content.data;

        if (data.roomId) openChat(data.roomId as string);
    });

    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }
}

export async function askForPushNotificationToken(): Promise<string | null> {
    if (!areNotificationsSupported()) return null;

    let status = (await Permissions.getAsync(Permissions.NOTIFICATIONS)).status;
    if (status !== "granted") status = (await Permissions.askAsync(Permissions.NOTIFICATIONS)).status;

    if (status === "granted") {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        return token;
    } else {
        // User refused notifications
        return null;
    }
}
