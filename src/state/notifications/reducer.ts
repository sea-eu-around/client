import {NotificationsState} from "../types";
import {NotificationsAction, NOTIFICATIONS_ACTION_TYPES} from "./actions";

export const initialState: NotificationsState = {};

export const notificationsReducer = (
    state: NotificationsState = initialState,
    action: NotificationsAction,
): NotificationsState => {
    switch (action.type) {
        case NOTIFICATIONS_ACTION_TYPES.REGISTER_SUCCESS: {
            return {...state};
        }
        default:
            return state;
    }
};
