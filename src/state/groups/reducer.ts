import {GroupsState, initialPaginatedState} from "../types";
import {FetchGroupsSuccessAction, GroupsAction, GROUP_ACTION_TYPES} from "./actions";

export const initialState: GroupsState = {
    pagination: initialPaginatedState(),
    groups: [],
    myGroupsPagination: initialPaginatedState(),
    myGroups: [],
};

export const groupsReducer = (state: GroupsState = initialState, action: GroupsAction): GroupsState => {
    switch (action.type) {
        case GROUP_ACTION_TYPES.FETCH_GROUPS_BEGIN: {
            return {...state, pagination: {...state.pagination, fetching: true}};
        }
        case GROUP_ACTION_TYPES.FETCH_GROUPS_FAILURE: {
            return {...state, pagination: {...state.pagination, fetching: false, canFetchMore: false}};
        }
        case GROUP_ACTION_TYPES.FETCH_GROUPS_SUCCESS: {
            const {groups, canFetchMore} = action as FetchGroupsSuccessAction;
            const pagination = state.pagination;
            return {
                ...state,
                groups: state.groups.concat(groups),
                pagination: {...pagination, fetching: false, page: pagination.page + 1, canFetchMore},
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
            return {
                ...state,
                myGroups: state.myGroups.concat(groups),
                myGroupsPagination: {...pagination, fetching: false, page: pagination.page + 1, canFetchMore},
            };
        }
        default:
            return state;
    }
};
