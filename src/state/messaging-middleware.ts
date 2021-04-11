import {AnyAction, Middleware, Dispatch, MiddlewareAPI} from "redux";
import {AppState, MyThunkDispatch} from "./types";
import {AUTH_ACTION_TYPES} from "./auth/actions";
import {fetchMatchRooms} from "./messaging/actions";

export const messagingMiddleware: Middleware<unknown, AppState> = (store: MiddlewareAPI<Dispatch, AppState>) => (
    next: Dispatch<AnyAction>,
) => (action: AnyAction) => {
    next(action);

    switch (action.type) {
        case AUTH_ACTION_TYPES.LOG_IN_SUCCESS: {
            (store.dispatch as MyThunkDispatch)(fetchMatchRooms());
            break;
        }
    }
};
