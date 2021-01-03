import {requestBackend} from "../../api/utils";
import {AppThunk} from "../types";
import {HttpStatusCode} from "../../constants/http-status";

export enum NOTIFICATIONS_ACTION_TYPES {
    REGISTER_TOKEN_SUCCESS = "NOTIFICATIONS/REGISTER_TOKEN_SUCCESS",
    DELETE_TOKEN_SUCCESS = "NOTIFICATIONS/DELETE_TOKEN_SUCCESS",
}

export type RegisterNotificationSuccessAction = {
    type: string;
};

export type DeleteNotificationTokenSuccessAction = {
    type: string;
};

export type NotificationsAction = RegisterNotificationSuccessAction & DeleteNotificationTokenSuccessAction;

export const registerNotificationToken = (pushToken: string): AppThunk => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend("notifications/token", "POST", {}, {token: pushToken}, token, true);
    if (response.status === HttpStatusCode.NO_CONTENT) {
        dispatch(registerNotificationTokenSuccess());
    }
};

const registerNotificationTokenSuccess = (): RegisterNotificationSuccessAction => ({
    type: NOTIFICATIONS_ACTION_TYPES.REGISTER_TOKEN_SUCCESS,
});

export const deleteNotificationToken = (): AppThunk => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend("notifications/token", "DELETE", {}, {}, token, true);
    if (response.status === HttpStatusCode.NO_CONTENT) {
        dispatch(deleteNotificationTokenSuccess());
    }
};

const deleteNotificationTokenSuccess = (): DeleteNotificationTokenSuccessAction => ({
    type: NOTIFICATIONS_ACTION_TYPES.DELETE_TOKEN_SUCCESS,
});
