import {combineReducers, createStore} from "redux";
import {authReducer} from "./auth/reducer";
import {themingReducer} from "./theming/reducer";
import {profileReducer} from "./profile/reducer";

const rootReducer = combineReducers({
    auth: authReducer,
    theming: themingReducer,
    profile: profileReducer,
});

export default createStore(rootReducer);
