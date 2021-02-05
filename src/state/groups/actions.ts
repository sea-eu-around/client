import {requestBackend} from "../../api/utils";
import {AppThunk, ValidatedThunkAction} from "../types";
import {HttpStatusCode} from "../../constants/http-status";
import {GROUPS_FETCH_LIMIT} from "../../constants/config";
import {
    CreateGroupDto,
    CreatePostDto,
    PaginatedRequestResponse,
    ResponseGroupDto,
    SuccessfulRequestResponse,
} from "../../api/dto";
import {Group} from "../../model/groups";
import {convertDtoToGroup} from "../../api/converters";
import {gatherValidationErrors} from "../../api/errors";

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
    FETCH_GROUPS_REFRESH = "GROUP/FETCH_GROUPS_REFRESH",
    FETCH_MYGROUPS_BEGIN = "GROUP/FETCH_MYGROUPS_BEGIN",
    FETCH_MYGROUPS_FAILURE = "GROUP/FETCH_MYGROUPS_FAILURE",
    FETCH_MYGROUPS_SUCCESS = "GROUP/FETCH_MYGROUPS_SUCCESS",
    FETCH_MYGROUPS_REFRESH = "GROUP/FETCH_MYGROUPS_REFRESH",
    JOIN_GROUP_SUCCESS = "GROUP/JOIN_GROUP_SUCCESS",
    CREATE_POST_BEGIN = "GROUP/CREATE_POST_BEGIN",
    CREATE_POST_SUCCESS = "GROUP/CREATE_POST_SUCCESS",
    CREATE_POST_FAILURE = "GROUP/CREATE_POST_FAILURE",
}

export type CreateGroupSuccessAction = {
    type: string;
};

export type CreateGroupFailureAction = {
    type: string;
};

export type UpdateGroupSuccessAction = {
    type: string;
    group: {id: string} & Partial<Group>;
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

export type FetchGroupsRefreshAction = {
    type: string;
};

export type JoinGroupSuccessAction = {
    type: string;
    group: Group;
};

export type CreatePostBeginAction = {
    type: string;
    group: Group;
};

export type CreatePostSuccessAction = {
    type: string;
    group: Group;
};

export type CreatePostFailureAction = {
    type: string;
};

export type GroupsAction = CreateGroupSuccessAction &
    CreateGroupFailureAction &
    UpdateGroupSuccessAction &
    UpdateGroupFailureAction &
    BeginFetchGroupsAction &
    FetchGroupsFailureAction &
    FetchGroupsSuccessAction &
    FetchGroupsRefreshAction &
    JoinGroupSuccessAction &
    CreatePostBeginAction &
    CreatePostFailureAction &
    CreatePostSuccessAction;

const createGroupSuccess = (): CreateGroupSuccessAction => ({
    type: GROUP_ACTION_TYPES.CREATE_SUCCESS,
});

const createGroupFailure = (): CreateGroupFailureAction => ({
    type: GROUP_ACTION_TYPES.CREATE_FAILURE,
});

const updateGroupSuccess = (group: {id: string} & Partial<Group>): UpdateGroupSuccessAction => ({
    type: GROUP_ACTION_TYPES.UPDATE_SUCCESS,
    group,
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

export const createGroup = (group: CreateGroupDto): ValidatedThunkAction => async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await requestBackend("groups", "POST", {}, group, token, true);
    if (response.status === HttpStatusCode.CREATED) {
        dispatch(createGroupSuccess());
        return {success: true};
    } else {
        dispatch(createGroupFailure());
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

export const updateGroup = (id: string, group: Partial<CreateGroupDto>): ValidatedThunkAction => async (
    dispatch,
    getState,
) => {
    const token = getState().auth.token;

    const response = await requestBackend(`groups/${id}`, "PATCH", {}, group, token, true);
    if (response.status === HttpStatusCode.OK) {
        const responseGroup = (response as SuccessfulRequestResponse).data as {id: string} & Partial<Group>;
        dispatch(updateGroupSuccess(responseGroup));
        return {success: true};
    } else {
        dispatch(updateGroupFailure());
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

export const deleteGroup = (id: string): ValidatedThunkAction => async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await requestBackend(`groups/${id}`, "DELETE", {}, {}, token, true);
    if (response.status === HttpStatusCode.NO_CONTENT) {
        dispatch(deleteGroupSuccess());
        return {success: true};
    } else {
        dispatch(deleteGroupFailure());
        return {success: false, errors: gatherValidationErrors(response)};
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

export const refreshFetchedGroups = (): FetchGroupsRefreshAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUPS_REFRESH,
});

export const fetchGroups = (search?: string): AppThunk => async (dispatch, getState) => {
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
            search,
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

export const fetchGroupMembers = (groupId: string): AppThunk<Promise<[]>> => async (dispatch, getState) => {
    const {token} = getState().auth;

    if (!token) return [];

    const response = await requestBackend(`groups/${groupId}/members`, "GET", {page: 1, limit: 50}, {}, token, true);

    if (response.status === HttpStatusCode.OK) {
        console.log(response);
        return [];
    } else return [];
};

const beginFetchMyGroups = (): BeginFetchGroupsAction => ({
    type: GROUP_ACTION_TYPES.FETCH_MYGROUPS_BEGIN,
});

const fetchMyGroupsSuccess = (groups: Group[], canFetchMore: boolean): FetchGroupsSuccessAction => ({
    type: GROUP_ACTION_TYPES.FETCH_MYGROUPS_SUCCESS,
    groups,
    canFetchMore,
});

const fetchMyGroupsFailure = (): FetchGroupsFailureAction => ({
    type: GROUP_ACTION_TYPES.FETCH_MYGROUPS_FAILURE,
});

export const refreshFetchedMyGroups = (): FetchGroupsRefreshAction => ({
    type: GROUP_ACTION_TYPES.FETCH_MYGROUPS_REFRESH,
});

export const fetchMyGroups = (): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        groups: {myGroupsPagination},
    } = getState();

    if (!token) {
        dispatch(fetchMyGroupsFailure());
        return;
    }

    if (myGroupsPagination.fetching || !myGroupsPagination.canFetchMore) return;

    dispatch(beginFetchMyGroups());

    const response = await requestBackend(
        "groups",
        "GET",
        {
            page: myGroupsPagination.page,
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
        dispatch(fetchMyGroupsSuccess(groups, canFetchMore));
    } else dispatch(fetchMyGroupsFailure());
};

const joinGroupSuccess = (group: Group): JoinGroupSuccessAction => ({
    type: GROUP_ACTION_TYPES.JOIN_GROUP_SUCCESS,
    group,
});

export const joinGroup = (group: Group): AppThunk<Promise<boolean>> => async (dispatch, getState) => {
    const {token} = getState().auth;

    if (!token) return false;

    const response = await requestBackend(`groups/${group.id}/members`, "POST", {}, {}, token, true);

    if (response.status === HttpStatusCode.CREATED) {
        dispatch(joinGroupSuccess(group));
        return true;
    } else return false;
};

const createGroupPostBegin = (group: Group): CreatePostBeginAction => ({
    type: GROUP_ACTION_TYPES.CREATE_POST_BEGIN,
    group,
});

const createGroupPostFailure = (): CreatePostFailureAction => ({
    type: GROUP_ACTION_TYPES.CREATE_POST_FAILURE,
});

const createGroupPostSuccess = (group: Group): CreatePostSuccessAction => ({
    type: GROUP_ACTION_TYPES.CREATE_POST_SUCCESS,
    group,
});

export const createGroupPost = (group: Group, dto: CreatePostDto): ValidatedThunkAction => async (
    dispatch,
    getState,
) => {
    const {token} = getState().auth;

    if (!token) return {success: false};

    dispatch(createGroupPostBegin(group));

    // TODO
    const response = await requestBackend(`groups/${group.id}/members`, "POST", {}, {}, token, true);

    if (response.status === HttpStatusCode.CREATED) {
        dispatch(createGroupPostSuccess(group));
        return {success: true};
    } else {
        dispatch(createGroupPostFailure());
        return {success: false, errors: gatherValidationErrors(response)};
    }
};
