import {GroupMemberStatus, GroupRole} from "../../api/dto";
import {arrayWithIdMapperToDict, arrayWithIdsToDict} from "../../general-utils";
import {Group, GroupMember, GroupPost, GROUP_VOTE_VALUES, PostSortingOrder} from "../../model/groups";
import {UserProfile} from "../../model/user-profile";
import {GroupsState, initialPaginatedState, PaginatedFetchSuccessActionRefreshable} from "../types";
import {
    CreateCommentSuccessAction,
    CreateGroupSuccessAction,
    CreatePostSuccessAction,
    DeleteCommentSuccessAction,
    DeleteGroupMemberSuccessAction,
    DeletePostSuccessAction,
    FetchAvailableMatchesBeginAction,
    FetchAvailableMatchesSuccessAction,
    FetchGroupMembersBeginAction,
    FetchGroupMembersFailureAction,
    FetchGroupMembersRefreshAction,
    FetchGroupMembersSuccessAction,
    FetchGroupPostsBeginAction,
    FetchGroupPostsFailureAction,
    FetchGroupPostsSuccessAction,
    FetchGroupSuccessAction,
    FetchMyGroupsBeginAction,
    FetchMyGroupsFailureAction,
    FetchMyGroupsSuccessAction,
    FetchPostCommentsBeginAction,
    FetchPostCommentsFailureAction,
    FetchPostCommentsRefreshAction,
    FetchPostCommentsSuccessAction,
    GroupsAction,
    GROUP_ACTION_TYPES,
    InviteToGroupSuccessAction,
    JoinGroupSuccessAction,
    LeaveGroupSuccessAction,
    SetCommentVoteBeginAction,
    SetGroupCoverBeginAction,
    SetGroupCoverFailureAction,
    SetGroupCoverSuccessAction,
    SetGroupMemberRoleSuccessAction,
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
            const {items, canFetchMore, refresh} = action as PaginatedFetchSuccessActionRefreshable<Group>;
            const pagination = state.pagination;
            const newState = items.reduce(setOrUpdateGroup, state);
            const ids = items.map((g: Group) => g.id);
            return {
                ...newState,
                groups: refresh ? ids : state.groups.concat(ids),
                pagination: {fetching: false, page: (refresh ? 1 : pagination.page) + 1, canFetchMore},
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
            const {items, canFetchMore, refresh} = action as PaginatedFetchSuccessActionRefreshable<GroupPost>;
            const ids = items.map((p) => p.id);
            return {
                ...state,
                postsFeedIds: refresh
                    ? ids
                    : state.postsFeedIds.concat(ids.filter((id) => state.postsFeedIds.indexOf(id) === -1)),
                postsFeed: {...state.postsFeed, ...arrayWithIdsToDict(items)},
                feedPagination: {
                    fetching: false,
                    page: (refresh ? 1 : state.feedPagination.page) + 1,
                    canFetchMore,
                },
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
            const {groupId, items, canFetchMore, refresh} = action as FetchGroupPostsSuccessAction;
            const ids = items.map((p) => p.id);
            return updateGroup(state, groupId, ({postsPagination: p, posts: gposts, postIds: gpostIds}) => ({
                postIds: refresh ? ids : gpostIds.concat(ids.filter((id) => gpostIds.indexOf(id) === -1)),
                posts: {...gposts, ...arrayWithIdsToDict(items)},
                postsPagination: {fetching: false, page: (refresh ? 1 : p.page) + 1, canFetchMore},
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
            return updatePost(state, groupId, post.id, () => ({
                status: post.status,
                type: post.type,
                text: post.text,
                updatedAt: post.updatedAt,
            }));
        }
        case GROUP_ACTION_TYPES.DELETE_POST_SUCCESS: {
            const {groupId, postId} = action as DeletePostSuccessAction;
            // Remove post from feed
            state = {...state, postsFeedIds: state.postsFeedIds.filter((id) => id !== postId)};
            // Remove post from group
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
                    canFetchMore: action.type === GROUP_ACTION_TYPES.FETCH_POST_COMMENTS_BEGIN,
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
        case GROUP_ACTION_TYPES.FETCH_POST_COMMENTS_REFRESH: {
            const {groupId, postId} = action as FetchPostCommentsRefreshAction;
            return updatePost(state, groupId, postId, ({commentsPagination: p}) => ({
                commentIds: [],
                commentsPagination: {...p, fetching: false, page: 1, canFetchMore: true},
            }));
        }

        case GROUP_ACTION_TYPES.CREATE_COMMENT_SUCCESS: {
            const {groupId, postId, comment, parentId} = action as CreateCommentSuccessAction;

            return updatePost(state, groupId, postId, ({comments, commentIds, commentsCount}) => {
                const updated: Partial<GroupPost> = {
                    commentsCount: commentsCount + 1,
                    comments: {...comments, [comment.id]: comment},
                };

                if (parentId) {
                    // Add the comment the its parent's children
                    const parent = comments[parentId];
                    if (parent) {
                        updated.comments = {
                            ...updated.comments,
                            [parentId]: {...parent, childrenIds: [comment.id].concat(parent.childrenIds)},
                        };
                    }
                } else updated.commentIds = [comment.id].concat(commentIds);

                return updated;
            });
        }
        case GROUP_ACTION_TYPES.UPDATE_COMMENT_SUCCESS: {
            const {groupId, postId, comments} = action as UpdateCommentSuccessAction;
            return updatePost(state, groupId, postId, ({comments: currentComments}) => {
                const updatedComments = {...currentComments};
                comments.forEach((c) => {
                    updatedComments[c.id] = {
                        ...currentComments[c.id],
                        text: c.text,
                        updatedAt: new Date(),
                    };
                });
                return {comments: updatedComments};
            });
        }
        case GROUP_ACTION_TYPES.DELETE_COMMENT_SUCCESS: {
            const {groupId, postId, commentId} = action as DeleteCommentSuccessAction;
            return updatePost(state, groupId, postId, (post) => {
                const {comments, commentIds, commentsCount} = post;
                const updated: Partial<GroupPost> = {commentsCount: commentsCount - 1};

                const comment = comments[commentId];
                const parent = comment && comment.parentId && comments[comment.parentId];
                if (parent) {
                    // If this comment has a parent, remove it from the parent's comments
                    updated.comments = {
                        ...comments,
                        [parent.id]: {
                            ...parent,
                            childrenIds: parent.childrenIds.filter((id) => id !== commentId),
                        },
                    };
                } else {
                    // Otherwise, simply remove the comment from the post
                    updated.commentIds = commentIds.filter((id) => id !== commentId);
                }
                return updated;
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
                        canFetchMore: action.type === GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_BEGIN,
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
        case GROUP_ACTION_TYPES.JOIN_GROUP_SUCCESS: {
            const {group, memberStatus, role, localUser} = action as JoinGroupSuccessAction;

            if (localUser && localUser.profile) {
                const member: GroupMember = {
                    profile: localUser.profile,
                    role,
                    status: memberStatus,
                };
                return updateMemberStatus(state, group.id, localUser.id, true, memberStatus, member);
            }
            return state;
        }
        case GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_REFRESH: {
            const {groupId, memberStatus} = action as FetchGroupMembersRefreshAction;
            return updateGroup(state, groupId, ({memberIds, membersPaginations}) => ({
                memberIds: {...memberIds, [memberStatus]: []},
                membersPaginations: {...membersPaginations, [memberStatus]: initialPaginatedState()},
            }));
        }

        case GROUP_ACTION_TYPES.DELETE_GROUP_MEMBER_SUCCESS: {
            const {groupId, profileId, isLocalUser} = action as DeleteGroupMemberSuccessAction;

            // If this user is us, remove the group from the arrays
            if (isLocalUser) {
                state = {
                    ...state,
                    myGroups: state.myGroups.filter((id) => id !== groupId),
                    myGroupInvites: state.myGroupInvites.filter((id) => id !== groupId),
                };
            }

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
            const {groupId, profileId, memberStatus, isLocalUser} = action as SetGroupMemberStatusSuccessAction;
            return updateMemberStatus(state, groupId, profileId, isLocalUser, memberStatus);
        }

        case GROUP_ACTION_TYPES.SET_GROUP_MEMBER_ROLE_SUCCESS: {
            const {groupId, profileId, role, isLocalUser} = action as SetGroupMemberRoleSuccessAction;

            // Change the member's role in the group
            return updateGroup(state, groupId, ({members}) => ({
                members: {...members, [profileId]: {...members[profileId], role: role}},
                ...(isLocalUser && {myRole: role}),
            }));
        }

        case GROUP_ACTION_TYPES.INVITE_TO_GROUP_SUCCESS: {
            const {groupId, profile /*, memberStatus*/} = action as InviteToGroupSuccessAction;
            return updateGroup(state, groupId, ({availableMatches: am}) => ({
                availableMatches: {
                    ...am,
                    profiles: am.profiles ? am.profiles.filter((p: UserProfile) => p.id !== profile.id) : null,
                },
                // members: {...members, [profile.id]: profile},
                // memberIds: {...memberIds, [memberStatus]: memberIds[memberIds].concat([profile.id])}
            }));
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
            const {items, canFetchMore, invites, refresh} = action as FetchMyGroupsSuccessAction;
            const paginationKey: keyof GroupsState = invites ? "myGroupInvitesPagination" : "myGroupsPagination";
            const itemsKey: keyof GroupsState = invites ? "myGroupInvites" : "myGroups";
            const pagination = state[paginationKey];
            const ids = items.map((g: Group) => g.id);
            return {
                ...state,
                groupsDict: {...state.groupsDict, ...arrayWithIdsToDict(items)},
                [itemsKey]: refresh ? ids : state[itemsKey].concat(ids),
                [paginationKey]: {
                    fetching: false,
                    page: (refresh ? 1 : pagination.page) + 1,
                    canFetchMore,
                },
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

        case GROUP_ACTION_TYPES.FETCH_AVAILABLE_MATCHES_FAILURE:
        case GROUP_ACTION_TYPES.FETCH_AVAILABLE_MATCHES_BEGIN: {
            const {groupId} = action as FetchAvailableMatchesBeginAction;
            return updateGroup(state, groupId, ({availableMatches}) => ({
                availableMatches: {
                    ...availableMatches,
                    fetching: action.type === GROUP_ACTION_TYPES.FETCH_AVAILABLE_MATCHES_BEGIN,
                    canFetchMore: action.type === GROUP_ACTION_TYPES.FETCH_AVAILABLE_MATCHES_BEGIN,
                },
            }));
        }
        case GROUP_ACTION_TYPES.FETCH_AVAILABLE_MATCHES_SUCCESS: {
            const {groupId, items} = action as FetchAvailableMatchesSuccessAction;
            return updateGroup(state, groupId, () => ({
                availableMatches: {profiles: items, fetching: false},
            }));
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

function updateMemberStatus(
    state: GroupsState,
    groupId: string,
    profileId: string,
    isLocalUser: boolean,
    status: GroupMemberStatus,
    fallbackMember?: GroupMember,
) {
    if (isLocalUser && state.groupsDict[groupId]) {
        const previousStatus = state.groupsDict[groupId].myStatus;
        // If I was previously an invite and not anymore, remove group from invites
        const wasInvite =
            previousStatus === GroupMemberStatus.Invited || previousStatus === GroupMemberStatus.InvitedByAdmin;
        const isNowInvite = status === GroupMemberStatus.Invited || status === GroupMemberStatus.InvitedByAdmin;
        if (wasInvite && !isNowInvite)
            state = {...state, myGroupInvites: state.myGroupInvites.filter((id) => id !== groupId)};
        // If I was approved and I'm not anymore, remove group from myGroups
        if (previousStatus === GroupMemberStatus.Approved && status !== GroupMemberStatus.Approved)
            state = {...state, myGroups: state.myGroups.filter((id) => id !== groupId)};
        // If i am now approved, add group to myGroups
        if (status === GroupMemberStatus.Approved) state = {...state, myGroups: [groupId].concat(state.myGroups)};
    }

    // Change the member's status in the group
    return updateGroup(state, groupId, ({members, memberIds, numApprovedMembers, myStatus: myPreviousStatus}) => {
        const member = members[profileId];
        const wasApproved = member
            ? member.status === GroupMemberStatus.Approved
            : isLocalUser
            ? myPreviousStatus === GroupMemberStatus.Approved
            : false;
        const isApproved = status === GroupMemberStatus.Approved;

        const updated = {
            numApprovedMembers:
                numApprovedMembers === null
                    ? null
                    : numApprovedMembers + (!wasApproved && isApproved ? 1 : wasApproved && !isApproved ? -1 : 0),
            ...(isLocalUser
                ? {
                      myStatus: status,
                      myRole: status === GroupMemberStatus.Approved ? GroupRole.Basic : null,
                  }
                : {}),
            memberIds: {
                ...memberIds,
                [status]: (memberIds[status] || []).concat([profileId]),
            },
            members: {...members},
        };

        // Register the new member in the members dict
        if (member || fallbackMember) {
            updated.members = {
                ...updated.members,
                [profileId]: (member ? {...member, status} : fallbackMember) as GroupMember,
            };
        }

        // Remove from ids of previous status
        if (member) {
            updated.memberIds = {
                ...updated.memberIds,
                [member.status]: updated.memberIds[member.status].filter((id) => id !== profileId),
            };
        }
        return updated;
    });
}
