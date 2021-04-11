import {NotificationsState} from "../types";
import {NotificationsAction} from "./actions";

export const initialState: NotificationsState = {};

export const notificationsReducer = (
    state: NotificationsState = initialState,
    action: NotificationsAction,
): NotificationsState => {
    switch (action.type) {
        default:
            return state;
    }
};
