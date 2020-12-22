import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import {Platform} from "react-native";

export function configureNotifications(): void {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
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
    if (Constants.isDevice) {
        let status = (await Permissions.getAsync(Permissions.NOTIFICATIONS)).status;
        if (status !== "granted") status = (await Permissions.askAsync(Permissions.NOTIFICATIONS)).status;

        if (status === "granted") {
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            return token;
        } else {
            // User refused notifications
            return null;
        }
    } else {
        // Not a physical device, so no push notifications
        return null;
    }
}
