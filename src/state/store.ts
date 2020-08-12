import {combineReducers, createStore} from "redux";
import {authReducer} from "./auth/reducer";

const rootReducer = combineReducers({
    authReducer,
});

export default createStore(rootReducer);
