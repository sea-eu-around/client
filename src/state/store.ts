import {applyMiddleware, combineReducers, createStore} from "redux";
import {authReducer} from "./auth/reducer";
import {settingsReducer} from "./settings/reducer";
import {profileReducer} from "./profile/reducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    auth: authReducer,
    settings: settingsReducer,
    profile: profileReducer,
});

export default createStore(rootReducer, applyMiddleware(thunk));
