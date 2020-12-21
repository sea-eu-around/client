import {applyMiddleware, combineReducers, createStore} from "redux";
import {authReducer} from "./auth/reducer";
import {settingsReducer} from "./settings/reducer";
import {profileReducer} from "./profile/reducer";
import {matchingReducer} from "./matching/reducer";
import {messagingReducer} from "./messaging/reducer";
import {notificationsReducer} from "./notifications/reducer";
import thunk from "redux-thunk";
import {navigationMiddleware} from "./navigation-middleware";
import {authStorageMiddleware} from "./auth-storage-middleware";
import {staticStorageMiddleware} from "./static-storage-middleware";

const rootReducer = combineReducers({
    auth: authReducer,
    settings: settingsReducer,
    profile: profileReducer,
    matching: matchingReducer,
    messaging: messagingReducer,
    notifications: notificationsReducer,
});

const combinedMiddleware = applyMiddleware(thunk, authStorageMiddleware, staticStorageMiddleware, navigationMiddleware);

export default createStore(rootReducer, combinedMiddleware);
