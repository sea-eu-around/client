import {ThemingState, ThemingAction} from "../types";
import {THEMING_ACTION_TYPES} from "./actions";

export const initialState: ThemingState = {
    theme: "light",
};

export const themingReducer = (state: ThemingState = initialState, action: ThemingAction): ThemingState => {
    const newState: ThemingState = {...state}; // shallow copy

    switch (action.type) {
        case THEMING_ACTION_TYPES.SET_THEME:
            return {...newState, theme: action.theme};
        default:
            return state;
    }
};
