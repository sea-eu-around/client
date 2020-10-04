import {applyMiddleware, combineReducers, createStore} from "redux";
import {authReducer} from "./auth/reducer";
import {themingReducer} from "./theming/reducer";
import {profileReducer} from "./profile/reducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    auth: authReducer,
    theming: themingReducer,
    profile: profileReducer,
});

export default createStore(rootReducer, applyMiddleware(thunk));
