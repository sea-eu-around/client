import {arrayWithIdsToDict} from "../../general-utils";
import {Group, GroupPost} from "../../model/groups";
import {GroupsState, initialPaginatedState} from "../types";
import {
    FetchGroupMembersBeginAction,
    FetchGroupMembersFailureAction,
    FetchGroupMembersSuccessAction,
    FetchGroupPostsBeginAction,
    FetchGroupPostsFailureAction,
    FetchGroupPostsSuccessAction,
    FetchGroupsSuccessAction,
    FetchPostCommentsBeginAction,
    FetchPostCommentsFailureAction,
    FetchPostCommentsSuccessAction,
    GroupsAction,
    GROUP_ACTION_TYPES,
    SetGroupCoverBeginAction,
    SetGroupCoverFailureAction,
    SetGroupCoverSuccessAction,
    UpdateCommentSuccessAction,
    UpdateGroupSuccessAction,
    UpdatePostSuccessAction,
} from "./actions";

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

        case GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_BEGIN:
        case GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_FAILURE: {
            const {groupId} = action as FetchGroupPostsBeginAction | FetchGroupPostsFailureAction;
            return updateGroup(state, groupId, ({postsPagination}) => ({
                postsPagination: {
                    ...postsPagination,
                    fetching: action.type === GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_BEGIN,
                },
            }));
        }
        case GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_SUCCESS: {
            const {groupId, posts, canFetchMore} = action as FetchGroupPostsSuccessAction;
            return updateGroup(state, groupId, ({postsPagination: p, posts: gposts, postIds: gpostIds}) => ({
                postIds: gpostIds.concat(posts.map((p) => p.id)),
                posts: {...gposts, ...arrayWithIdsToDict(posts)},
                postsPagination: {...p, fetching: false, page: p.page + 1, canFetchMore},
            }));
        }

        case GROUP_ACTION_TYPES.UPDATE_POST_SUCCESS: {
            const {groupId, post} = action as UpdatePostSuccessAction;
            return updateGroup(state, groupId, ({posts}) => ({
                posts: {
                    ...posts,
                    [post.id]: {...posts[post.id], status: post.status, type: post.type, text: post.text},
                },
            }));
        }

        case GROUP_ACTION_TYPES.FETCH_POST_COMMENTS_BEGIN:
        case GROUP_ACTION_TYPES.FETCH_POST_COMMENTS_FAILURE: {
            const {groupId, postId} = action as FetchPostCommentsBeginAction | FetchPostCommentsFailureAction;
            return updatePost(state, groupId, postId, ({commentsPagination}) => ({
                commentsPagination: {
                    ...commentsPagination,
                    fetching: action.type === GROUP_ACTION_TYPES.FETCH_POST_COMMENTS_BEGIN,
                },
            }));
        }
        case GROUP_ACTION_TYPES.FETCH_POST_COMMENTS_SUCCESS: {
            const {groupId, postId, comments, canFetchMore} = action as FetchPostCommentsSuccessAction;
            return updatePost(
                state,
                groupId,
                postId,
                ({commentsPagination: p, comments: pcomments, commentIds: pcommentIds}) => ({
                    commentIds: pcommentIds.concat(comments.map((c) => c.id)),
                    comments: {...pcomments, ...arrayWithIdsToDict(comments)},
                    commentsPagination: {...p, fetching: false, page: p.page + 1, canFetchMore},
                }),
            );
        }

        case GROUP_ACTION_TYPES.UPDATE_COMMENT_SUCCESS: {
            const {groupId, postId, comment} = action as UpdateCommentSuccessAction;
            return updatePost(state, groupId, postId, ({comments}) => ({
                comments: {
                    ...comments,
                    [comment.id]: {...comments[comment.id], text: comment.text},
                },
            }));
        }

        case GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_BEGIN:
        case GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_FAILURE: {
            const {groupId} = action as FetchGroupMembersBeginAction | FetchGroupMembersFailureAction;
            return updateGroup(state, groupId, ({membersPagination}) => ({
                membersPagination: {
                    ...membersPagination,
                    fetching: action.type === GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_BEGIN,
                },
            }));
        }
        case GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_SUCCESS: {
            const {groupId, members, canFetchMore} = action as FetchGroupMembersSuccessAction;
            return updateGroup(state, groupId, ({membersPagination: p, members: gm}) => ({
                members: (gm || []).concat(members),
                membersPagination: {...p, fetching: false, page: p.page + 1, canFetchMore},
            }));
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
        case GROUP_ACTION_TYPES.FETCH_MYGROUPS_REFRESH: {
            return {
                ...state,
                myGroups: [],
                myGroupsPagination: initialPaginatedState(),
            };
        }

        case GROUP_ACTION_TYPES.SET_COVER_BEGIN: {
            const {groupId} = action as SetGroupCoverBeginAction;
            return updateGroup(state, groupId, () => ({uploadingCover: true}));
        }
        case GROUP_ACTION_TYPES.SET_COVER_FAILURE: {
            const {groupId} = action as SetGroupCoverFailureAction;
            return updateGroup(state, groupId, () => ({uploadingCover: false}));
        }
        case GROUP_ACTION_TYPES.SET_COVER_SUCCESS: {
            const {groupId, url} = action as SetGroupCoverSuccessAction;
            return updateGroup(state, groupId, () => ({uploadingCover: false, cover: url}));
        }
        default:
            return state;
    }
};

function updateGroup(state: GroupsState, groupId: string, update: (g: Group) => Partial<Group>): GroupsState {
    const g = state.groupsDict[groupId];
    if (g) {
        return {...state, groupsDict: {...state.groupsDict, [groupId]: {...g, ...update(g)}}};
    } else {
        console.error("Anomaly: cannot update group (not in memory).");
        return state;
    }
}

function updatePost(
    state: GroupsState,
    groupId: string,
    postId: string,
    update: (p: GroupPost) => Partial<GroupPost>,
): GroupsState {
    const g = state.groupsDict[groupId];
    if (g) {
        const p = g.posts[postId];
        if (p) {
            return {
                ...state,
                groupsDict: {
                    ...state.groupsDict,
                    [groupId]: {...g, posts: {...g.posts, [postId]: {...p, ...update(p)}}},
                },
            };
        } else {
            console.error("Anomaly: cannot update post (not in memory).");
            return state;
        }
    } else {
        console.error("Anomaly: cannot update post (group not in memory).");
        return state;
    }
}
