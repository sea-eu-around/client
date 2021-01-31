import {requestBackend} from "../../api/utils";
import {AppThunk} from "../types";
import {HttpStatusCode} from "../../constants/http-status";
import {GROUPS_FETCH_LIMIT} from "../../constants/config";
import {CreateGroupDto, PaginatedRequestResponse, ResponseGroupDto} from "../../api/dto";
import {Group} from "../../model/groups";
import {convertDtoToGroup} from "../../api/converters";

export enum GROUP_ACTION_TYPES {
    CREATE_SUCCESS = "GROUP/CREATE_SUCCESS",
    CREATE_FAILURE = "GROUP/CREATE_FAILURE",
    UPDATE_SUCCESS = "GROUP/UPDATE_SUCCESS",
    UPDATE_FAILURE = "GROUP/UPDATE_FAILURE",
    DELETE_SUCCESS = "GROUP/DELETE_SUCCESS",
    DELETE_FAILURE = "GROUP/DELETE_FAILURE",
    FETCH_GROUPS_BEGIN = "GROUP/FETCH_GROUPS_BEGIN",
    FETCH_GROUPS_FAILURE = "GROUP/FETCH_GROUPS_FAILURE",
    FETCH_GROUPS_SUCCESS = "GROUP/FETCH_GROUPS_SUCCESS",
}

export type CreateGroupSuccessAction = {
    type: string;
};

export type CreateGroupFailureAction = {
    type: string;
};

export type UpdateGroupSuccessAction = {
    type: string;
};

export type UpdateGroupFailureAction = {
    type: string;
};

export type DeleteGroupSuccessAction = {
    type: string;
};

export type DeleteGroupFailureAction = {
    type: string;
};

export type BeginFetchGroupsAction = {
    type: string;
};

export type FetchGroupsFailureAction = {
    type: string;
};

export type FetchGroupsSuccessAction = {
    type: string;
    groups: Group[];
    canFetchMore: boolean;
};

export type GroupsAction = CreateGroupSuccessAction &
    CreateGroupFailureAction &
    UpdateGroupSuccessAction &
    UpdateGroupFailureAction &
    BeginFetchGroupsAction &
    FetchGroupsFailureAction &
    FetchGroupsSuccessAction;

const createGroupSuccess = (): CreateGroupSuccessAction => ({
    type: GROUP_ACTION_TYPES.CREATE_SUCCESS,
});

const createGroupFailure = (): CreateGroupFailureAction => ({
    type: GROUP_ACTION_TYPES.CREATE_FAILURE,
});

const updateGroupSuccess = (): UpdateGroupSuccessAction => ({
    type: GROUP_ACTION_TYPES.UPDATE_SUCCESS,
});

const updateGroupFailure = (): UpdateGroupFailureAction => ({
    type: GROUP_ACTION_TYPES.UPDATE_FAILURE,
});

const deleteGroupSuccess = (): DeleteGroupSuccessAction => ({
    type: GROUP_ACTION_TYPES.DELETE_SUCCESS,
});

const deleteGroupFailure = (): DeleteGroupFailureAction => ({
    type: GROUP_ACTION_TYPES.DELETE_FAILURE,
});

export const createGroup = (group: CreateGroupDto): AppThunk<Promise<boolean>> => async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await requestBackend("groups", "POST", {}, group, token, true);
    if (response.status === HttpStatusCode.CREATED) {
        dispatch(createGroupSuccess());
        return true;
    } else {
        dispatch(createGroupFailure());
        return false;
    }
};

export const updateGroup = (id: string, group: Partial<CreateGroupDto>): AppThunk<Promise<boolean>> => async (
    dispatch,
    getState,
) => {
    const token = getState().auth.token;

    const response = await requestBackend(`groups/${id}`, "PATCH", {}, group, token, true);
    if (response.status === HttpStatusCode.OK) {
        dispatch(updateGroupSuccess());
        return true;
    } else {
        dispatch(updateGroupFailure());
        return false;
    }
};

export const deleteGroup = (id: string): AppThunk<Promise<boolean>> => async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await requestBackend(`groups/${id}`, "DELETE", {}, {}, token, true);
    if (response.status === HttpStatusCode.NO_CONTENT) {
        dispatch(deleteGroupSuccess());
        return true;
    } else {
        dispatch(deleteGroupFailure());
        return false;
    }
};

const beginFetchGroups = (): BeginFetchGroupsAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUPS_BEGIN,
});

const fetchGroupsSuccess = (groups: Group[], canFetchMore: boolean): FetchGroupsSuccessAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUPS_SUCCESS,
    groups,
    canFetchMore,
});

const fetchGroupsFailure = (): FetchGroupsFailureAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUPS_FAILURE,
});

export const fetchGroups = (): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        groups: {pagination},
    } = getState();

    if (!token) {
        dispatch(fetchGroupsFailure());
        return;
    }

    if (pagination.fetching || !pagination.canFetchMore) return;

    dispatch(beginFetchGroups());

    const response = await requestBackend(
        "groups",
        "GET",
        {
            page: pagination.page,
            limit: GROUPS_FETCH_LIMIT,
        },
        {},
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const groups = (paginated.data as ResponseGroupDto[]).map(convertDtoToGroup);
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        console.log("fetched", groups.length, "groups");
        console.log("meta", paginated.meta);
        dispatch(fetchGroupsSuccess(groups, canFetchMore));
    } else dispatch(fetchGroupsFailure());
};
