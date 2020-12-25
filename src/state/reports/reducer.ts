import {ReportsState} from "../types";
import {ReportAction} from "./actions";

export const initialState: ReportsState = {};

export const reportsReducer = (state: ReportsState = initialState, action: ReportAction): ReportsState => {
    switch (action.type) {
        default:
            return state;
    }
};
