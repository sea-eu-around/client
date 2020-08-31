import {combineReducers, createStore} from "redux";
import {authReducer} from "./auth/reducer";
import {themingReducer} from "./theming/reducer";

const rootReducer = combineReducers({
    auth: authReducer,
    theming: themingReducer,
});

export default createStore(rootReducer);
