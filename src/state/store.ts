import {applyMiddleware, combineReducers, createStore} from "redux";
import {authReducer} from "./auth/reducer";
import {settingsReducer} from "./settings/reducer";
import {profileReducer} from "./profile/reducer";
import {matchingReducer} from "./matching/reducer";
import thunk from "redux-thunk";
import {navigationMiddleware} from "./navigation-middleware";

const rootReducer = combineReducers({
    auth: authReducer,
    settings: settingsReducer,
    profile: profileReducer,
    matching: matchingReducer,
});

export default createStore(rootReducer, applyMiddleware(thunk, navigationMiddleware));
