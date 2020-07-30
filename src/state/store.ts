import { combineReducers, createStore } from "redux";
import { authReducer } from "./auth/reducer";
import { AppState } from "./types";


const rootReducer = combineReducers({
    authReducer,
})


export default createStore(rootReducer);