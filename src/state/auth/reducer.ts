import {AuthState, AuthAction, LogInSuccessAction} from "../types";
import {AUTH_ACTION_TYPES} from "./actions";

export const initialState: AuthState = {
    authenticated: false,
    token: "",
    connecting: false,
};

export const authReducer = (state: AuthState = initialState, action: AuthAction) => {
    const newState: AuthState = {...state}; // shallow copy

    switch (action.type) {
        case AUTH_ACTION_TYPES.LOG_IN_REQUEST:
            return {...newState, connecting: true};
        case AUTH_ACTION_TYPES.LOG_IN_FAILURE:
            return {...newState, connecting: false};
        case AUTH_ACTION_TYPES.LOG_IN_SUCCESS:
            const {token} = <LogInSuccessAction>action;
            return {...newState, connecting: false, authenticated: true, token};
        case AUTH_ACTION_TYPES.LOG_OUT:
            return {...newState, token: "", authenticated: false};
        default:
            return state;
    }
};
