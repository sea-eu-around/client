import {requestBackend} from "../../api/utils";
import {AppThunk} from "../types";
import {HttpStatusCode} from "../../constants/http-status";

export enum NOTIFICATIONS_ACTION_TYPES {
    REGISTER_SUCCESS = "NOTIFICATIONS/REGISTER_SUCCESS",
}

export type NotificationsRegisterSuccessAction = {
    type: string;
};

export type NotificationsAction = NotificationsRegisterSuccessAction;

export const registerNotifications = (): AppThunk => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend("notifications/register", "POST", {}, {token: ""}, token, true);
    if (response.status === HttpStatusCode.NO_CONTENT) {
        dispatch(registerNotificationsSuccess());
    }
};

const registerNotificationsSuccess = (): NotificationsRegisterSuccessAction => ({
    type: NOTIFICATIONS_ACTION_TYPES.REGISTER_SUCCESS,
});
