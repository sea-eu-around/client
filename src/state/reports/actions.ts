import {AppThunk} from "../types";
import {requestBackend} from "../../api/utils";
import {HttpStatusCode} from "../../constants/http-status";
import {ReportEntityType, ReportType} from "../../constants/reports";

export enum REPORT_ACTION_TYPES {
    REPORT_ENTITY_SUCCESS = "REPORTS/REPORT_ENTITY_SUCCESS",
    REPORT_ENTITY_FAILURE = "REPORTS/REPORT_ENTITY_FAILURE",
}

export type ReportEntitySuccessAction = {
    type: string;
    reportType: ReportType;
    entityType: ReportEntityType;
    entityId: string;
};

export type ReportEntityFailureAction = {
    type: string;
    reportType: ReportType;
    entityType: ReportEntityType;
    entityId: string;
};

export type ReportAction = ReportEntitySuccessAction | ReportEntityFailureAction;

const reportEntitySuccess = (
    reportType: ReportType,
    entityType: ReportEntityType,
    entityId: string,
): ReportEntitySuccessAction => ({
    type: REPORT_ACTION_TYPES.REPORT_ENTITY_SUCCESS,
    reportType,
    entityType,
    entityId,
});

const reportEntityFailure = (
    reportType: ReportType,
    entityType: ReportEntityType,
    entityId: string,
): ReportEntityFailureAction => ({
    type: REPORT_ACTION_TYPES.REPORT_ENTITY_FAILURE,
    reportType,
    entityType,
    entityId,
});

export const reportEntity = (
    type: ReportType,
    entityType: ReportEntityType,
    entityId: string,
): AppThunk<Promise<boolean>> => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend("reports", "POST", {}, {type, entityType, entityId}, token, true);

    if (response.status === HttpStatusCode.OK) {
        dispatch(reportEntitySuccess(type, entityType, entityId));
        return true;
    } else {
        dispatch(reportEntityFailure(type, entityType, entityId));
        return false;
    }
};
