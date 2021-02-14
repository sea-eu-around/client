import * as Notifications from "expo-notifications";
import {Platform} from "react-native";
import {openChat} from "./navigation/utils";
import {ResponseChatMessageDto} from "./api/dto";
import {receiveChatMessage} from "./state/messaging/actions";
import {areNotificationsSupported, getNotificationData} from "./notifications-utils";
import store from "./state/store";
import {DEBUG_MODE} from "./constants/config";

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
        const data = getNotificationData(notification);

        if (DEBUG_MODE) {
            console.log("Notification received:");
            console.log(data);
        }

        if (data.roomId && data.text) {
            const message = data as ResponseChatMessageDto;
            store.dispatch(receiveChatMessage(message));
        }
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.notification ? getNotificationData(response.notification) : (response as any).body;

        if (data.roomId) openChat(data.roomId as string);

        Notifications.getPresentedNotificationsAsync().then((notifs: Notifications.Notification[]) => {
            if (data.roomId) {
                // Dismiss all notifications of the same room
                notifs
                    .filter((n) => getNotificationData(n).roomId === data.roomId)
                    .map((n) => n.request.identifier)
                    .forEach(Notifications.dismissNotificationAsync);
            }
        });
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
