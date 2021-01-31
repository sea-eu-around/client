import {GroupsState, initialPaginatedState} from "../types";
import {GroupsAction} from "./actions";

export const initialState: GroupsState = {
    pagination: initialPaginatedState(),
};

export const groupsReducer = (state: GroupsState = initialState, action: GroupsAction): GroupsState => {
    switch (action.type) {
        default:
            return state;
    }
};
