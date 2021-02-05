import {Group} from "../../model/groups";
import {GroupsState, initialPaginatedState} from "../types";
import {FetchGroupsSuccessAction, GroupsAction, GROUP_ACTION_TYPES, UpdateGroupSuccessAction} from "./actions";

export const initialState: GroupsState = {
    groupsDict: {},
    pagination: initialPaginatedState(),
    groups: [],
    myGroupsPagination: initialPaginatedState(),
    myGroups: [],
};

export const groupsReducer = (state: GroupsState = initialState, action: GroupsAction): GroupsState => {
    switch (action.type) {
        case GROUP_ACTION_TYPES.UPDATE_SUCCESS: {
            const {group} = action as UpdateGroupSuccessAction;
            return {...state, groupsDict: {...state.groupsDict, [group.id]: {...state.groupsDict[group.id], ...group}}};
        }
        case GROUP_ACTION_TYPES.FETCH_GROUPS_BEGIN: {
            return {...state, pagination: {...state.pagination, fetching: true}};
        }
        case GROUP_ACTION_TYPES.FETCH_GROUPS_FAILURE: {
            return {...state, pagination: {...state.pagination, fetching: false, canFetchMore: false}};
        }
        case GROUP_ACTION_TYPES.FETCH_GROUPS_SUCCESS: {
            const {groups, canFetchMore} = action as FetchGroupsSuccessAction;
            const pagination = state.pagination;
            const groupsDict = {...state.groupsDict};
            groups.forEach((g: Group) => (groupsDict[g.id] = g));
            return {
                ...state,
                groupsDict,
                groups: state.groups.concat(groups),
                pagination: {...pagination, fetching: false, page: pagination.page + 1, canFetchMore},
            };
        }
        case GROUP_ACTION_TYPES.FETCH_GROUPS_REFRESH: {
            return {
                ...state,
                groups: [],
                pagination: initialPaginatedState(),
            };
        }
        case GROUP_ACTION_TYPES.FETCH_MYGROUPS_BEGIN: {
            return {...state, myGroupsPagination: {...state.myGroupsPagination, fetching: true}};
        }
        case GROUP_ACTION_TYPES.FETCH_MYGROUPS_FAILURE: {
            return {...state, myGroupsPagination: {...state.myGroupsPagination, fetching: false, canFetchMore: false}};
        }
        case GROUP_ACTION_TYPES.FETCH_MYGROUPS_SUCCESS: {
            const {groups, canFetchMore} = action as FetchGroupsSuccessAction;
            const pagination = state.myGroupsPagination;
            const groupsDict = {...state.groupsDict};
            groups.forEach((g: Group) => (groupsDict[g.id] = g));
            return {
                ...state,
                groupsDict,
                myGroups: state.myGroups.concat(groups),
                myGroupsPagination: {...pagination, fetching: false, page: pagination.page + 1, canFetchMore},
            };
        }
        default:
            return state;
    }
};
