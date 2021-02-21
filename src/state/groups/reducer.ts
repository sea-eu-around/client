import {GroupMemberStatus} from "../../api/dto";
import {arrayWithIdMapperToDict, arrayWithIdsToDict} from "../../general-utils";
import {Group, GroupPost, GROUP_VOTE_VALUES, PostSortingOrder} from "../../model/groups";
import {GroupsState, initialPaginatedState, PaginatedFetchSuccessAction} from "../types";
import {
    CreateCommentSuccessAction,
    CreateGroupSuccessAction,
    CreatePostSuccessAction,
    DeleteCommentSuccessAction,
    DeleteGroupMemberSuccessAction,
    DeletePostSuccessAction,
    FetchGroupMembersBeginAction,
    FetchGroupMembersFailureAction,
    FetchGroupMembersRefreshAction,
    FetchGroupMembersSuccessAction,
    FetchGroupPostsBeginAction,
    FetchGroupPostsFailureAction,
    FetchGroupPostsRefreshAction,
    FetchGroupPostsSuccessAction,
    FetchGroupSuccessAction,
    FetchMyGroupsBeginAction,
    FetchMyGroupsFailureAction,
    FetchMyGroupsRefreshAction,
    FetchMyGroupsSuccessAction,
    FetchPostCommentsBeginAction,
    FetchPostCommentsFailureAction,
    FetchPostCommentsSuccessAction,
    GroupsAction,
    GROUP_ACTION_TYPES,
    LeaveGroupSuccessAction,
    SetCommentVoteBeginAction,
    SetGroupCoverBeginAction,
    SetGroupCoverFailureAction,
    SetGroupCoverSuccessAction,
    SetGroupMemberStatusSuccessAction,
    SetPostSortingOrderAction,
    SetPostVoteBeginAction,
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
    myGroupInvitesPagination: initialPaginatedState(),
    myGroupInvites: [],
    postsSortOrder: PostSortingOrder.Newest,
    feedPagination: initialPaginatedState(),
    postsFeed: {},
    postsFeedIds: [],
};

export const groupsReducer = (state: GroupsState = initialState, action: GroupsAction): GroupsState => {
    switch (action.type) {
        case GROUP_ACTION_TYPES.CREATE_SUCCESS: {
            const {group} = action as CreateGroupSuccessAction;
            return {
                ...state,
                groupsDict: {...state.groupsDict, [group.id]: group},
                myGroups: [group.id].concat(state.myGroups),
            };
        }
        case GROUP_ACTION_TYPES.UPDATE_SUCCESS: {
            const {group} = action as UpdateGroupSuccessAction;
            return updateGroup(state, group.id, () => group);
        }

        case GROUP_ACTION_TYPES.LEAVE_SUCCESS: {
            const {id} = action as LeaveGroupSuccessAction;
            return {
                ...state,
                myGroups: state.myGroups.filter((groupId) => groupId !== id),
            };
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
            const newState = items.reduce(setOrUpdateGroup, state);
            return {
                ...newState,
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

        case GROUP_ACTION_TYPES.FETCH_GROUP_SUCCESS: {
            const {group} = action as FetchGroupSuccessAction;
            return setOrUpdateGroup(state, group);
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
                posts: {...gposts, ...arrayWithIdsToDict(items)},
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
        // Update on begin action so it doesn't look slow
        case GROUP_ACTION_TYPES.SET_POST_VOTE_BEGIN: {
            const {groupId, postId, status} = action as SetPostVoteBeginAction;
            return updatePost(state, groupId, postId, ({score, voteStatus}) => ({
                voteStatus: status,
                // Add value of new vote, remove value of previous vote
                score: score + GROUP_VOTE_VALUES[status] - GROUP_VOTE_VALUES[voteStatus],
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

        case GROUP_ACTION_TYPES.CREATE_COMMENT_SUCCESS: {
            const {groupId, postId, comment} = action as CreateCommentSuccessAction;
            return updatePost(state, groupId, postId, ({comments, commentIds, commentsCount}) => ({
                comments: {...comments, [comment.id]: comment},
                commentIds: [comment.id].concat(commentIds),
                commentsCount: commentsCount + 1,
            }));
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
            return updatePost(state, groupId, postId, ({comments, commentIds, commentsCount}) => {
                delete comments[commentId];
                return {
                    comments,
                    commentIds: commentIds.filter((id) => id !== commentId),
                    commentsCount: commentsCount - 1,
                };
            });
        }
        // Update on begin action so it doesn't look slow
        case GROUP_ACTION_TYPES.SET_COMMENT_VOTE_BEGIN: {
            const {groupId, postId, commentId, status} = action as SetCommentVoteBeginAction;
            return updatePost(state, groupId, postId, ({comments}) => ({
                comments: {
                    ...comments,
                    [commentId]: {
                        ...comments[commentId],
                        voteStatus: status,
                        // Add value of new vote, remove value of previous vote
                        score:
                            comments[commentId].score +
                            GROUP_VOTE_VALUES[status] -
                            GROUP_VOTE_VALUES[comments[commentId].voteStatus],
                    },
                },
            }));
        }

        case GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_BEGIN:
        case GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_FAILURE: {
            const {groupId, memberStatus} = action as FetchGroupMembersBeginAction | FetchGroupMembersFailureAction;
            return updateGroup(state, groupId, ({membersPaginations}) => ({
                membersPaginations: {
                    ...membersPaginations,
                    [memberStatus]: {
                        ...membersPaginations[memberStatus],
                        fetching: action.type === GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_BEGIN,
                    },
                },
            }));
        }
        case GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_SUCCESS: {
            const {
                groupId,
                items,
                canFetchMore,
                totalItems,
                memberStatus,
                search,
            } = action as FetchGroupMembersSuccessAction;

            return updateGroup(state, groupId, ({membersPaginations, members, memberIds}) => ({
                members: {...members, ...arrayWithIdMapperToDict(items, (it) => it.profile.id)},
                memberIds: {
                    ...memberIds,
                    [memberStatus]: memberIds[memberStatus].concat(
                        items.map((m) => m.profile.id).filter((id) => memberIds[memberStatus].indexOf(id) === -1),
                    ),
                },
                membersPaginations: {
                    ...membersPaginations,
                    [memberStatus]: {
                        ...membersPaginations[memberStatus],
                        fetching: false,
                        page: membersPaginations[memberStatus].page + 1,
                        canFetchMore,
                    },
                },
                // Update number of approved members
                ...(memberStatus === GroupMemberStatus.Approved && !search ? {numApprovedMembers: totalItems} : {}),
            }));
        }
        case GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_REFRESH: {
            const {groupId, memberStatus} = action as FetchGroupMembersRefreshAction;
            return updateGroup(state, groupId, ({memberIds, membersPaginations}) => ({
                memberIds: {...memberIds, [memberStatus]: []},
                membersPaginations: {...membersPaginations, [memberStatus]: initialPaginatedState()},
            }));
        }

        case GROUP_ACTION_TYPES.DELETE_GROUP_MEMBER_SUCCESS: {
            const {groupId, profileId} = action as DeleteGroupMemberSuccessAction;
            return updateGroup(state, groupId, ({memberIds, members}) => {
                const member = members[profileId];
                if (member) {
                    // Remove the member from the right array, depending on his status
                    return {
                        memberIds: {
                            ...memberIds,
                            [member.status]: memberIds[member.status].filter((id) => id !== profileId),
                        },
                    };
                } else {
                    // If we didn't have this member, do nothing
                    return {};
                }
            });
        }
        case GROUP_ACTION_TYPES.SET_GROUP_MEMBER_STATUS_SUCCESS: {
            const {groupId, profileId, memberStatus} = action as SetGroupMemberStatusSuccessAction;
            return updateGroup(state, groupId, ({members, memberIds}) => {
                const member = members[profileId];
                if (member) {
                    return {
                        members: {...members, [profileId]: {...member, status: memberStatus}},
                        memberIds: {
                            ...memberIds,
                            [member.status]: memberIds[member.status].filter((id) => id !== profileId),
                            [memberStatus]: memberIds[memberStatus].concat([profileId]),
                        },
                    };
                } else return {};
            });
        }

        case GROUP_ACTION_TYPES.FETCH_MYGROUPS_BEGIN: {
            const {invites} = action as FetchMyGroupsBeginAction;
            const paginationKey: keyof GroupsState = invites ? "myGroupInvitesPagination" : "myGroupsPagination";
            return {...state, [paginationKey]: {...state[paginationKey], fetching: true}};
        }
        case GROUP_ACTION_TYPES.FETCH_MYGROUPS_FAILURE: {
            const {invites} = action as FetchMyGroupsFailureAction;
            const paginationKey: keyof GroupsState = invites ? "myGroupInvitesPagination" : "myGroupsPagination";
            return {...state, [paginationKey]: {...state[paginationKey], fetching: false, canFetchMore: false}};
        }
        case GROUP_ACTION_TYPES.FETCH_MYGROUPS_SUCCESS: {
            const {items, canFetchMore, invites} = action as FetchMyGroupsSuccessAction;
            const paginationKey: keyof GroupsState = invites ? "myGroupInvitesPagination" : "myGroupsPagination";
            const itemsKey: keyof GroupsState = invites ? "myGroupInvites" : "myGroups";
            const pagination = state[paginationKey];
            return {
                ...state,
                groupsDict: {...state.groupsDict, ...arrayWithIdsToDict(items)},
                [itemsKey]: state[itemsKey].concat(items.map((g: Group) => g.id)),
                [paginationKey]: {...pagination, fetching: false, page: pagination.page + 1, canFetchMore},
            };
        }
        case GROUP_ACTION_TYPES.FETCH_MYGROUPS_REFRESH: {
            const {invites} = action as FetchMyGroupsRefreshAction;
            const paginationKey: keyof GroupsState = invites ? "myGroupInvitesPagination" : "myGroupsPagination";
            const itemsKey: keyof GroupsState = invites ? "myGroupInvites" : "myGroups";
            return {
                ...state,
                [itemsKey]: [],
                [paginationKey]: initialPaginatedState(),
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

function setOrUpdateGroup(state: GroupsState, group: Group): GroupsState {
    const g = state.groupsDict[group.id];
    if (g) return updateGroup(state, group.id, () => group);
    else return {...state, groupsDict: {...state.groupsDict, [group.id]: group}};
}

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
    const s = {...state};
    const g = s.groupsDict[groupId];
    // Update the post in the group it belongs to
    if (g && g.posts[postId]) {
        s.groupsDict = {
            ...s.groupsDict,
            [groupId]: {...g, posts: {...g.posts, [postId]: {...g.posts[postId], ...update(g.posts[postId])}}},
        };
    }
    // Update the post in the feed
    if (s.postsFeed[postId]) {
        s.postsFeed = {
            ...s.postsFeed,
            [postId]: {...s.postsFeed[postId], ...update(s.postsFeed[postId])},
        };
    }
    return s;
}
