import {MessagingState, MessagingAction} from "../types";

export const initialState: MessagingState = {
    temp: undefined,
};

export const messagingReducer = (state: MessagingState = initialState, action: MessagingAction): MessagingState => {
    switch (action.type) {
        default:
            return state;
    }
};
