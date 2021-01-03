import {AnyAction, Middleware, Dispatch, MiddlewareAPI} from "redux";
import {AppState, MyThunkDispatch} from "./types";
import {AUTH_ACTION_TYPES} from "./auth/actions";
import {askForPushNotificationToken} from "../notifications";
import {deleteNotificationToken, registerNotificationToken} from "./notifications/actions";

export const notificationsMiddleware: Middleware<unknown, AppState> = (store: MiddlewareAPI<Dispatch, AppState>) => (
    next: Dispatch<AnyAction>,
) => (action: AnyAction) => {
    switch (action.type) {
        case AUTH_ACTION_TYPES.LOG_IN_SUCCESS: {
            // Register push notifications
            askForPushNotificationToken().then((pushToken: string | null) => {
                // The token will be null if the device does not support push notifications,
                // or we did not get permission from the user.
                if (pushToken !== null) (store.dispatch as MyThunkDispatch)(registerNotificationToken(pushToken));
            });
            break;
        }
        case AUTH_ACTION_TYPES.LOG_OUT: {
            // Discard the token
            (store.dispatch as MyThunkDispatch)(deleteNotificationToken());
            break;
        }
    }
    next(action);
};
