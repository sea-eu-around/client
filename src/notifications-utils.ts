import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import {Platform} from "react-native";

export function areNotificationsSupported(): boolean {
    return Constants.isDevice && Platform.OS !== "web";
}

export function getNotificationData(notif: Notifications.Notification): {[key: string]: unknown} {
    return notif.request.content.data;
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
