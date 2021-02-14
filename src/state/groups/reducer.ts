import {arrayWithIdsToDict} from "../../general-utils";
import {Group, GroupPost, PostSortingOrder} from "../../model/groups";
import {GroupsState, initialPaginatedState, PaginatedFetchSuccessAction} from "../types";
import {
    CreatePostSuccessAction,
    DeleteCommentSuccessAction,
    DeletePostSuccessAction,
    FetchGroupMembersBeginAction,
    FetchGroupMembersFailureAction,
    FetchGroupMembersSuccessAction,
    FetchGroupPostsBeginAction,
    FetchGroupPostsFailureAction,
    FetchGroupPostsRefreshAction,
    FetchGroupPostsSuccessAction,
    FetchPostCommentsBeginAction,
    FetchPostCommentsFailureAction,
    FetchPostCommentsSuccessAction,
    GroupsAction,
    GROUP_ACTION_TYPES,
    SetCommentVoteSuccessAction,
    SetGroupCoverBeginAction,
    SetGroupCoverFailureAction,
    SetGroupCoverSuccessAction,
    SetPostSortingOrderAction,
    SetPostVoteSuccessAction,
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
    postsSortOrder: PostSortingOrder.Newest,
    feedPagination: initialPaginatedState(),
    postsFeed: {},
    postsFeedIds: [],
};

export const groupsReducer = (state: GroupsState = initialState, action: GroupsAction): GroupsState => {
    switch (action.type) {
        case GROUP_ACTION_TYPES.UPDATE_SUCCESS: {
            const {group} = action as UpdateGroupSuccessAction;
            return updateGroup(state, group.id, () => group);
        }

        case GROUP_ACTION_TYPES.FETCH_GROUPS_BEGIN: {
            return {...state, pagination: {...state.pagination, fetching: true}};
        }
        case GROUP_ACTION_TYPES.FETCH_GROUPS_FAILURE: {
            return {...state, pagination: {...state.pagination, fetching: false, canFetchMore: false}};
        }
        case GROUP_ACTION_TYPES.FETCH_GROUPS_SUCCESS: {
            const {items, canFetchMore} = action as PaginatedFetchSuccessAction<Group>;
            const pagination = state.pagination;
            const groupsDict = {...state.groupsDict};
            items.forEach((g: Group) => (groupsDict[g.id] = g));
            return {
                ...state,
                groupsDict,
                groups: state.groups.concat(items.map((g: Group) => g.id)),
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

        case GROUP_ACTION_TYPES.FETCH_POSTS_FEED_BEGIN:
        case GROUP_ACTION_TYPES.FETCH_POSTS_FEED_FAILURE: {
            return {
                ...state,
                feedPagination: {
                    ...state.feedPagination,
                    fetching: action.type === GROUP_ACTION_TYPES.FETCH_POSTS_FEED_BEGIN,
                    canFetchMore: action.type === GROUP_ACTION_TYPES.FETCH_POSTS_FEED_BEGIN,
                },
            };
        }
        case GROUP_ACTION_TYPES.FETCH_POSTS_FEED_SUCCESS: {
            const {items, canFetchMore} = action as PaginatedFetchSuccessAction<GroupPost>;
            return {
                ...state,
                postsFeedIds: state.postsFeedIds.concat(
                    items.map((p) => p.id).filter((id) => state.postsFeedIds.indexOf(id) === -1),
                ),
                postsFeed: {...state.postsFeed, ...arrayWithIdsToDict(items)},
                feedPagination: {
                    ...state.feedPagination,
                    fetching: false,
                    page: state.feedPagination.page + 1,
                    canFetchMore,
                },
            };
        }
        case GROUP_ACTION_TYPES.FETCH_POSTS_FEED_REFRESH: {
            return {
                ...state,
                feedPagination: initialPaginatedState(),
                postsFeedIds: [],
            };
        }

        case GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_BEGIN:
        case GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_FAILURE: {
            const {groupId} = action as FetchGroupPostsBeginAction | FetchGroupPostsFailureAction;
            return updateGroup(state, groupId, ({postsPagination}) => ({
                postsPagination: {
                    ...postsPagination,
                    fetching: action.type === GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_BEGIN,
                    canFetchMore: action.type === GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_BEGIN,
                },
            }));
        }
        case GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_SUCCESS: {
            const {groupId, items, canFetchMore} = action as FetchGroupPostsSuccessAction;
            return updateGroup(state, groupId, ({postsPagination: p, posts: gposts, postIds: gpostIds}) => ({
                postIds: gpostIds.concat(items.map((p) => p.id).filter((id) => gpostIds.indexOf(id) === -1)),
                //posts: {...gposts, ...arrayWithIdsToDict(items)},
                // TODO remove this
                posts: {...gposts, ...arrayWithIdsToDict(items.map((i) => ({...i, groupId})))},
                postsPagination: {...p, fetching: false, page: p.page + 1, canFetchMore},
            }));
        }
        case GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_REFRESH: {
            const {groupId} = action as FetchGroupPostsRefreshAction;
            return updateGroup(state, groupId, ({}) => ({
                postIds: [],
                postsPagination: initialPaginatedState(),
            }));
        }

        case GROUP_ACTION_TYPES.CREATE_POST_SUCCESS: {
            const {groupId, post} = action as CreatePostSuccessAction;
            return updateGroup(state, groupId, ({posts, postIds}) => ({
                posts: {...posts, [post.id]: post},
                postIds: [post.id].concat(postIds),
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
        case GROUP_ACTION_TYPES.DELETE_POST_SUCCESS: {
            const {groupId, postId} = action as DeletePostSuccessAction;
            return updateGroup(state, groupId, ({posts, postIds}) => {
                delete posts[postId];
                return {
                    posts,
                    postIds: postIds.filter((id) => id !== postId),
                };
            });
        }
        case GROUP_ACTION_TYPES.SET_POST_VOTE_SUCCESS: {
            const {groupId, postId, status} = action as SetPostVoteSuccessAction;
            return updatePost(state, groupId, postId, () => ({voteStatus: status}));
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
            const {groupId, postId, items, canFetchMore} = action as FetchPostCommentsSuccessAction;
            return updatePost(
                state,
                groupId,
                postId,
                ({commentsPagination: p, comments: pcomments, commentIds: pcommentIds}) => ({
                    commentIds: pcommentIds.concat(items.map((c) => c.id)),
                    comments: {...pcomments, ...arrayWithIdsToDict(items)},
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
        case GROUP_ACTION_TYPES.DELETE_COMMENT_SUCCESS: {
            const {groupId, postId, commentId} = action as DeleteCommentSuccessAction;
            return updatePost(state, groupId, postId, ({comments, commentIds}) => {
                delete comments[commentId];
                return {
                    comments,
                    commentIds: commentIds.filter((id) => id !== commentId),
                };
            });
        }
        case GROUP_ACTION_TYPES.SET_COMMENT_VOTE_SUCCESS: {
            const {groupId, postId, commentId, status} = action as SetCommentVoteSuccessAction;
            return updatePost(state, groupId, postId, ({comments}) => ({
                comments: {...comments, [commentId]: {...comments[commentId], voteStatus: status}},
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
            const {groupId, items, canFetchMore} = action as FetchGroupMembersSuccessAction;
            return updateGroup(state, groupId, ({membersPagination: p, members: gm}) => ({
                members: (gm || []).concat(items),
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
            const {items, canFetchMore} = action as PaginatedFetchSuccessAction<Group>;
            const pagination = state.myGroupsPagination;
            const groupsDict = {...state.groupsDict};
            items.forEach((g: Group) => (groupsDict[g.id] = g));
            return {
                ...state,
                groupsDict,
                myGroups: state.myGroups.concat(items.map((g: Group) => g.id)),
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

        case GROUP_ACTION_TYPES.SET_POST_SORTING_ORDER: {
            const {order} = action as SetPostSortingOrderAction;
            return {...state, postsSortOrder: order};
        }
        default:
            return state;
    }
};

function updateGroup(state: GroupsState, groupId: string, update: (g: Group) => Partial<Group>): GroupsState {
    const g = state.groupsDict[groupId];
    if (g) {
        const updated = update(g);
        return {
            ...state,
            groupsDict: {
                ...state.groupsDict,
                [groupId]: {
                    ...g,
                    ...updated,
                    members: updated.members || g.members, // prevents members from being replaced with null
                },
            },
        };
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
