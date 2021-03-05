import {requestBackend} from "../../api/utils";
import {
    AppThunk,
    PaginatedFetchBeginAction,
    PaginatedFetchFailureAction,
    PaginatedFetchRefreshAction,
    PaginatedFetchSuccessAction,
    ValidatedThunkAction,
} from "../types";
import {HttpStatusCode} from "../../constants/http-status";
import {GROUPS_FETCH_LIMIT, POSTS_FEED_FETCH_LIMIT} from "../../constants/config";
import {
    CreateGroupDto,
    CreateGroupPostDto,
    CreatePostCommentDto,
    GroupCoverSuccessfullyUpdatedDto,
    GroupMemberStatus,
    GroupRole,
    PaginatedRequestResponse,
    ResponseGroupDto,
    ResponseGroupMemberDto,
    ResponseGroupPostDto,
    ResponsePostCommentDto,
    ResponseProfileDto,
    SuccessfulRequestResponse,
} from "../../api/dto";
import {Group, GroupMember, GroupPost, PostComment, PostSortingOrder, GroupVoteStatus} from "../../model/groups";
import {
    convertDtoToGroup,
    convertDtoToGroupMember,
    convertDtoToGroupPost,
    convertDtoToPostComments,
    convertDtoToProfile,
} from "../../api/converters";
import {gatherValidationErrors} from "../../api/errors";
import {ImageInfo} from "expo-image-picker/build/ImagePicker.types";
import {uploadImage} from "../../api/media-upload";
import {UserProfile} from "../../model/user-profile";
import {findComment, findPost} from "./helpers";

export enum GROUP_ACTION_TYPES {
    CREATE_SUCCESS = "GROUP/CREATE_SUCCESS",
    CREATE_FAILURE = "GROUP/CREATE_FAILURE",
    UPDATE_SUCCESS = "GROUP/UPDATE_SUCCESS",
    UPDATE_FAILURE = "GROUP/UPDATE_FAILURE",
    DELETE_SUCCESS = "GROUP/DELETE_SUCCESS",
    DELETE_FAILURE = "GROUP/DELETE_FAILURE",
    LEAVE_SUCCESS = "GROUP/LEAVE_SUCCESS",
    FETCH_POSTS_FEED_BEGIN = "GROUP/FETCH_POSTS_FEED_BEGIN",
    FETCH_POSTS_FEED_SUCCESS = "GROUP/FETCH_POSTS_FEED_SUCCESS",
    FETCH_POSTS_FEED_FAILURE = "GROUP/FETCH_POSTS_FEED_FAILURE",
    FETCH_POSTS_FEED_REFRESH = "GROUP/FETCH_POSTS_FEED_REFRESH",
    FETCH_GROUPS_BEGIN = "GROUP/FETCH_GROUPS_BEGIN",
    FETCH_GROUPS_FAILURE = "GROUP/FETCH_GROUPS_FAILURE",
    FETCH_GROUPS_SUCCESS = "GROUP/FETCH_GROUPS_SUCCESS",
    FETCH_GROUPS_REFRESH = "GROUP/FETCH_GROUPS_REFRESH",
    FETCH_GROUP_SUCCESS = "GROUP/FETCH_GROUP_SUCCESS",
    FETCH_GROUP_MEMBERS_BEGIN = "GROUP/FETCH_GROUP_MEMBERS_BEGIN",
    FETCH_GROUP_MEMBERS_SUCCESS = "GROUP/FETCH_GROUP_MEMBERS_SUCCESS",
    FETCH_GROUP_MEMBERS_FAILURE = "GROUP/FETCH_GROUP_MEMBERS_FAILURE",
    FETCH_GROUP_MEMBERS_REFRESH = "GROUP/FETCH_GROUP_MEMBERS_REFRESH",
    DELETE_GROUP_MEMBER_SUCCESS = "GROUP/DELETE_GROUP_MEMBER_SUCCESS",
    SET_GROUP_MEMBER_STATUS_SUCCESS = "GROUP/SET_GROUP_MEMBER_STATUS_SUCCESS",
    SET_GROUP_MEMBER_ROLE_SUCCESS = "GROUP/SET_GROUP_MEMBER_ROLE_SUCCESS",
    INVITE_TO_GROUP_SUCCESS = "GROUP/INVITE_TO_GROUP_SUCCESS",
    FETCH_GROUP_POSTS_BEGIN = "GROUP/FETCH_GROUP_POSTS_BEGIN",
    FETCH_GROUP_POSTS_SUCCESS = "GROUP/FETCH_GROUP_POSTS_SUCCESS",
    FETCH_GROUP_POSTS_FAILURE = "GROUP/FETCH_GROUP_POSTS_FAILURE",
    FETCH_GROUP_POSTS_REFRESH = "GROUP/FETCH_GROUP_POSTS_REFRESH",
    FETCH_POST_COMMENTS_BEGIN = "GROUP/FETCH_POST_COMMENTS_BEGIN",
    FETCH_POST_COMMENTS_SUCCESS = "GROUP/FETCH_POST_COMMENTS_SUCCESS",
    FETCH_POST_COMMENTS_FAILURE = "GROUP/FETCH_POST_COMMENTS_FAILURE",
    FETCH_POST_COMMENTS_REFRESH = "GROUP/FETCH_POST_COMMENTS_REFRESH",
    FETCH_MYGROUPS_BEGIN = "GROUP/FETCH_MYGROUPS_BEGIN",
    FETCH_MYGROUPS_FAILURE = "GROUP/FETCH_MYGROUPS_FAILURE",
    FETCH_MYGROUPS_SUCCESS = "GROUP/FETCH_MYGROUPS_SUCCESS",
    FETCH_MYGROUPS_REFRESH = "GROUP/FETCH_MYGROUPS_REFRESH",
    JOIN_GROUP_SUCCESS = "GROUP/JOIN_GROUP_SUCCESS",
    CREATE_POST_BEGIN = "GROUP/CREATE_POST_BEGIN",
    CREATE_POST_SUCCESS = "GROUP/CREATE_POST_SUCCESS",
    CREATE_POST_FAILURE = "GROUP/CREATE_POST_FAILURE",
    UPDATE_POST_SUCCESS = "GROUP/UPDATE_POST_SUCCESS",
    DELETE_POST_SUCCESS = "GROUP/DELETE_POST_SUCCESS",
    CREATE_COMMENT_BEGIN = "GROUP/CREATE_COMMENT_BEGIN",
    CREATE_COMMENT_SUCCESS = "GROUP/CREATE_COMMENT_SUCCESS",
    CREATE_COMMENT_FAILURE = "GROUP/CREATE_COMMENT_FAILURE",
    UPDATE_COMMENT_SUCCESS = "GROUP/UPDATE_COMMENT_SUCCESS",
    DELETE_COMMENT_SUCCESS = "GROUP/DELETE_COMMENT_SUCCESS",
    SET_COVER_BEGIN = "GROUP/SET_COVER_BEGIN",
    SET_COVER_SUCCESS = "GROUP/SET_COVER_SUCCESS",
    SET_COVER_FAILURE = "GROUP/SET_COVER_FAILURE",
    SET_POST_SORTING_ORDER = "GROUP/SET_POST_SORTING_ORDER",
    SET_POST_VOTE_BEGIN = "GROUP/SET_POST_VOTE_BEGIN",
    SET_POST_VOTE_SUCCESS = "GROUP/SET_POST_VOTE_SUCCESS",
    SET_COMMENT_VOTE_BEGIN = "GROUP/SET_COMMENT_VOTE_BEGIN",
    SET_COMMENT_VOTE_SUCCESS = "GROUP/SET_COMMENT_VOTE_SUCCESS",
    FETCH_AVAILABLE_MATCHES_BEGIN = "GROUP/FETCH_AVAILABLE_MATCHES_BEGIN",
    FETCH_AVAILABLE_MATCHES_FAILURE = "GROUP/FETCH_AVAILABLE_MATCHES_FAILURE",
    FETCH_AVAILABLE_MATCHES_SUCCESS = "GROUP/FETCH_AVAILABLE_MATCHES_SUCCESS",
}

export type CreateGroupSuccessAction = {type: string; group: Group};
export type CreateGroupFailureAction = {type: string};

export type UpdateGroupSuccessAction = {
    type: string;
    group: {id: string} & Partial<Group>;
};
export type UpdateGroupFailureAction = {type: string};

export type DeleteGroupSuccessAction = {type: string};
export type DeleteGroupFailureAction = {type: string};

export type LeaveGroupSuccessAction = {type: string; id: string};

export type FetchGroupSuccessAction = {type: string; group: Group};

export type FetchMyGroupsBeginAction = {invites: boolean} & PaginatedFetchBeginAction;
export type FetchMyGroupsFailureAction = {invites: boolean} & PaginatedFetchFailureAction;
export type FetchMyGroupsSuccessAction = {invites: boolean} & PaginatedFetchSuccessAction<Group>;
export type FetchMyGroupsRefreshAction = {invites: boolean} & PaginatedFetchRefreshAction;

export type FetchGroupMembersBeginAction = PaginatedFetchBeginAction & {
    groupId: string;
    memberStatus: GroupMemberStatus;
};
export type FetchGroupMembersSuccessAction = PaginatedFetchSuccessAction<GroupMember> & {
    groupId: string;
    memberStatus: GroupMemberStatus;
    totalItems: number;
    search?: string;
};
export type FetchGroupMembersRefreshAction = PaginatedFetchRefreshAction & {
    groupId: string;
    memberStatus: GroupMemberStatus;
};
export type FetchGroupMembersFailureAction = PaginatedFetchFailureAction & {
    groupId: string;
    memberStatus: GroupMemberStatus;
};

export type DeleteGroupMemberSuccessAction = {
    type: string;
    groupId: string;
    profileId: string;
    isLocalUser: boolean;
};
export type SetGroupMemberStatusSuccessAction = {
    type: string;
    groupId: string;
    profileId: string;
    memberStatus: GroupMemberStatus;
    isLocalUser: boolean;
};

export type SetGroupMemberRoleSuccessAction = {
    type: string;
    groupId: string;
    profileId: string;
    role: GroupRole;
    isLocalUser: boolean;
};

export type InviteToGroupSuccessAction = {
    type: string;
    groupId: string;
    profile: UserProfile;
    memberStatus: GroupMemberStatus;
};

export type FetchGroupPostsBeginAction = PaginatedFetchBeginAction & {groupId: string};
export type FetchGroupPostsSuccessAction = PaginatedFetchSuccessAction<GroupPost> & {groupId: string};
export type FetchGroupPostsRefreshAction = PaginatedFetchRefreshAction & {groupId: string};
export type FetchGroupPostsFailureAction = PaginatedFetchFailureAction & {groupId: string};

export type FetchPostCommentsBeginAction = PaginatedFetchBeginAction & {groupId: string; postId: string};
export type FetchPostCommentsSuccessAction = PaginatedFetchSuccessAction<PostComment> & {
    groupId: string;
    postId: string;
};
export type FetchPostCommentsFailureAction = PaginatedFetchFailureAction & {groupId: string; postId: string};
export type FetchPostCommentsRefreshAction = PaginatedFetchRefreshAction & {groupId: string; postId: string};

export type JoinGroupSuccessAction = {
    type: string;
    group: Group;
};

export type CreatePostBeginAction = {
    type: string;
    groupId: string;
};
export type CreatePostSuccessAction = {
    type: string;
    groupId: string;
    post: GroupPost;
};
export type CreatePostFailureAction = {type: string};

export type UpdatePostSuccessAction = {
    type: string;
    groupId: string;
    post: GroupPost;
};

export type DeletePostSuccessAction = {
    type: string;
    groupId: string;
    postId: string;
};

export type CreateCommentBeginAction = {
    type: string;
    groupId: string;
    postId: string;
};
export type CreateCommentSuccessAction = {
    type: string;
    groupId: string;
    postId: string;
    comment: PostComment;
    parentId: string | null;
};
export type CreateCommentFailureAction = {type: string};

export type UpdateCommentSuccessAction = {
    type: string;
    groupId: string;
    postId: string;
    comments: PostComment[]; // possibly children getting updated too
};

export type DeleteCommentSuccessAction = {
    type: string;
    groupId: string;
    postId: string;
    commentId: string;
};

export type SetGroupCoverBeginAction = {
    type: string;
    groupId: string;
};
export type SetGroupCoverSuccessAction = {
    type: string;
    groupId: string;
    url: string;
};
export type SetGroupCoverFailureAction = {
    type: string;
    groupId: string;
};

export type SetPostSortingOrderAction = {
    type: string;
    order: PostSortingOrder;
};

export type SetPostVoteBeginAction = {
    type: string;
    groupId: string;
    postId: string;
    status: GroupVoteStatus;
};

export type SetPostVoteSuccessAction = {
    type: string;
    groupId: string;
    postId: string;
    status: GroupVoteStatus;
};

export type SetCommentVoteBeginAction = {
    type: string;
    groupId: string;
    postId: string;
    commentId: string;
    status: GroupVoteStatus;
};

export type SetCommentVoteSuccessAction = {
    type: string;
    groupId: string;
    postId: string;
    commentId: string;
    status: GroupVoteStatus;
};

export type FetchAvailableMatchesBeginAction = {type: string; groupId: string};
export type FetchAvailableMatchesFailureAction = {type: string; groupId: string};
export type FetchAvailableMatchesSuccessAction = {type: string; groupId: string; items: UserProfile[]};

export type GroupsAction = CreateGroupSuccessAction &
    CreateGroupFailureAction &
    UpdateGroupSuccessAction &
    UpdateGroupFailureAction &
    LeaveGroupSuccessAction &
    FetchGroupSuccessAction &
    FetchMyGroupsBeginAction &
    FetchMyGroupsFailureAction &
    FetchMyGroupsSuccessAction &
    FetchMyGroupsRefreshAction &
    PaginatedFetchBeginAction &
    PaginatedFetchFailureAction &
    PaginatedFetchSuccessAction<Group> &
    PaginatedFetchRefreshAction &
    FetchGroupMembersBeginAction &
    FetchGroupMembersFailureAction &
    FetchGroupMembersSuccessAction &
    FetchGroupMembersRefreshAction &
    DeleteGroupMemberSuccessAction &
    SetGroupMemberStatusSuccessAction &
    SetGroupMemberRoleSuccessAction &
    InviteToGroupSuccessAction &
    FetchGroupPostsBeginAction &
    FetchGroupPostsFailureAction &
    FetchGroupPostsSuccessAction &
    FetchGroupPostsRefreshAction &
    FetchPostCommentsBeginAction &
    FetchPostCommentsFailureAction &
    FetchPostCommentsSuccessAction &
    FetchPostCommentsRefreshAction &
    JoinGroupSuccessAction &
    CreatePostBeginAction &
    CreatePostFailureAction &
    CreatePostSuccessAction &
    UpdatePostSuccessAction &
    DeletePostSuccessAction &
    CreateCommentBeginAction &
    CreateCommentFailureAction &
    CreateCommentSuccessAction &
    UpdateCommentSuccessAction &
    DeleteCommentSuccessAction &
    SetGroupCoverBeginAction &
    SetGroupCoverFailureAction &
    SetGroupCoverSuccessAction &
    SetPostSortingOrderAction &
    SetPostVoteBeginAction &
    SetPostVoteSuccessAction &
    SetCommentVoteBeginAction &
    SetCommentVoteSuccessAction &
    FetchAvailableMatchesBeginAction &
    FetchAvailableMatchesFailureAction &
    FetchAvailableMatchesSuccessAction;

const createGroupSuccess = (group: Group): CreateGroupSuccessAction => ({
    type: GROUP_ACTION_TYPES.CREATE_SUCCESS,
    group,
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

    const dto: CreateGroupDto = {
        ...group,
        name: group.name.trim(),
    };

    const response = await requestBackend("groups", "POST", {}, dto, token, true);
    if (response.status === HttpStatusCode.CREATED) {
        const payload = (response as SuccessfulRequestResponse).data as ResponseGroupDto;
        const createdGroup = convertDtoToGroup(payload);
        dispatch(createGroupSuccess(createdGroup));
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

const leaveGroupSuccess = (id: string): LeaveGroupSuccessAction => ({
    type: GROUP_ACTION_TYPES.LEAVE_SUCCESS,
    id,
});

export const leaveGroup = (id: string): AppThunk<Promise<boolean>> => async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await requestBackend(`groups/${id}`, "DELETE", {}, {}, token, true);
    if (response.status === HttpStatusCode.NO_CONTENT) {
        dispatch(leaveGroupSuccess(id));
        return true;
    } else {
        return false;
    }
};

const beginFetchGroups = (): PaginatedFetchBeginAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUPS_BEGIN,
});

const fetchGroupsSuccess = (groups: Group[], canFetchMore: boolean): PaginatedFetchSuccessAction<Group> => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUPS_SUCCESS,
    items: groups,
    canFetchMore,
});

const fetchGroupsFailure = (): PaginatedFetchFailureAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUPS_FAILURE,
});

export const refreshFetchedGroups = (): PaginatedFetchRefreshAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUPS_REFRESH,
});

export const fetchGroups = (search?: string): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        groups: {pagination},
        profile: {user},
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
            search: search && search.length > 0 ? search : undefined,
            profileId: user?.id || undefined,
        },
        {},
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const groups = (paginated.data as ResponseGroupDto[]).map(convertDtoToGroup);
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        dispatch(fetchGroupsSuccess(groups, canFetchMore));
    } else dispatch(fetchGroupsFailure());
};

const fetchGroupSuccess = (group: Group): FetchGroupSuccessAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_SUCCESS,
    group,
});

export const fetchGroup = (groupId: string): AppThunk => async (dispatch, getState) => {
    const {token} = getState().auth;

    if (!token) return;

    const response = await requestBackend(`groups/${groupId}`, "GET", {}, {}, token);

    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        const group = convertDtoToGroup(payload as ResponseGroupDto);
        dispatch(fetchGroupSuccess(group));
    }
};

const fetchPostsFeedBegin = (): PaginatedFetchBeginAction => ({
    type: GROUP_ACTION_TYPES.FETCH_POSTS_FEED_BEGIN,
});

const fetchPostsFeedSuccess = (items: GroupPost[], canFetchMore: boolean): PaginatedFetchSuccessAction<GroupPost> => ({
    type: GROUP_ACTION_TYPES.FETCH_POSTS_FEED_SUCCESS,
    items,
    canFetchMore,
});

const fetchPostsFeedFailure = (): PaginatedFetchFailureAction => ({
    type: GROUP_ACTION_TYPES.FETCH_POSTS_FEED_FAILURE,
});

export const refreshFetchedPostsFeed = (): PaginatedFetchRefreshAction => ({
    type: GROUP_ACTION_TYPES.FETCH_POSTS_FEED_REFRESH,
});

export const fetchPostsFeed = (): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        groups: {feedPagination},
    } = getState();

    if (feedPagination.fetching || !feedPagination.canFetchMore) return;

    dispatch(fetchPostsFeedBegin());

    const response = await requestBackend(
        "groups/feed",
        "GET",
        {page: feedPagination.page, limit: POSTS_FEED_FETCH_LIMIT},
        {},
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const posts = (paginated.data as ResponseGroupPostDto[]).map((p) => convertDtoToGroupPost(p));
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        dispatch(fetchPostsFeedSuccess(posts, canFetchMore));
    } else dispatch(fetchPostsFeedFailure());
};

const fetchGroupPostsBegin = (groupId: string): FetchGroupPostsBeginAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_BEGIN,
    groupId,
});

const fetchGroupPostsSuccess = (
    groupId: string,
    items: GroupPost[],
    canFetchMore: boolean,
): FetchGroupPostsSuccessAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_SUCCESS,
    groupId,
    items,
    canFetchMore,
});

const fetchGroupPostsFailure = (groupId: string): FetchGroupPostsFailureAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_FAILURE,
    groupId,
});

export const refreshFetchedGroupPosts = (groupId: string): FetchGroupPostsRefreshAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_REFRESH,
    groupId,
});

export const fetchGroupPosts = (groupId: string): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        groups: {groupsDict, postsSortOrder},
    } = getState();

    const g = groupsDict[groupId];

    if (!g || g.postsPagination.fetching || !g.postsPagination.canFetchMore) return;

    dispatch(fetchGroupPostsBegin(groupId));

    const response = await requestBackend(
        `groups/${groupId}/posts`,
        "GET",
        {page: g.postsPagination.page, limit: 50, type: postsSortOrder},
        {},
        token,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const posts = (paginated.data as ResponseGroupPostDto[]).map((p) => convertDtoToGroupPost(p));
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        dispatch(fetchGroupPostsSuccess(groupId, posts, canFetchMore));
    } else dispatch(fetchGroupPostsFailure(groupId));
};

const fetchPostCommentsBegin = (groupId: string, postId: string): FetchPostCommentsBeginAction => ({
    type: GROUP_ACTION_TYPES.FETCH_POST_COMMENTS_BEGIN,
    groupId,
    postId,
});

const fetchPostCommentsSuccess = (
    groupId: string,
    postId: string,
    items: PostComment[],
    canFetchMore: boolean,
): FetchPostCommentsSuccessAction => ({
    type: GROUP_ACTION_TYPES.FETCH_POST_COMMENTS_SUCCESS,
    groupId,
    postId,
    items,
    canFetchMore,
});

const fetchPostCommentsFailure = (groupId: string, postId: string): FetchPostCommentsFailureAction => ({
    type: GROUP_ACTION_TYPES.FETCH_POST_COMMENTS_FAILURE,
    groupId,
    postId,
});

export const fetchPostCommentsRefresh = (groupId: string, postId: string): FetchPostCommentsRefreshAction => ({
    type: GROUP_ACTION_TYPES.FETCH_POST_COMMENTS_REFRESH,
    groupId,
    postId,
});

export const fetchPostComments = (groupId: string, postId: string): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        groups,
    } = getState();

    // Try to get the post from storage (from its group or from the feed)
    const p = findPost(groups, groupId, postId);

    if (!p || p.commentsPagination.fetching || !p.commentsPagination.canFetchMore) return;

    dispatch(fetchPostCommentsBegin(groupId, postId));

    const response = await requestBackend(
        `groups/${groupId}/posts/${postId}/comments`,
        "GET",
        {page: p.commentsPagination.page, limit: 50},
        {},
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const comments = (paginated.data as ResponsePostCommentDto[]).flatMap((c) => convertDtoToPostComments(c));
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        dispatch(fetchPostCommentsSuccess(groupId, postId, comments, canFetchMore));
    } else dispatch(fetchPostCommentsFailure(groupId, postId));
};

const fetchGroupMembersBegin = (groupId: string, memberStatus: GroupMemberStatus): FetchGroupMembersBeginAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_BEGIN,
    groupId,
    memberStatus,
});

const fetchGroupMembersSuccess = (
    groupId: string,
    items: GroupMember[],
    canFetchMore: boolean,
    totalItems: number,
    memberStatus: GroupMemberStatus,
    search?: string,
): FetchGroupMembersSuccessAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_SUCCESS,
    groupId,
    items,
    canFetchMore,
    totalItems,
    memberStatus,
    search,
});

const fetchGroupMembersFailure = (
    groupId: string,
    memberStatus: GroupMemberStatus,
): FetchGroupMembersFailureAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_FAILURE,
    groupId,
    memberStatus,
});

export const fetchGroupMembersRefresh = (
    groupId: string,
    memberStatus: GroupMemberStatus,
): FetchGroupMembersRefreshAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_REFRESH,
    groupId,
    memberStatus,
});

export const fetchGroupMembers = (groupId: string, status: GroupMemberStatus, search?: string): AppThunk => async (
    dispatch,
    getState,
) => {
    const {
        auth: {token},
        groups: {groupsDict},
    } = getState();

    const g = groupsDict[groupId];
    if (!g) return;

    const pagination = g.membersPaginations[status];
    if (pagination.fetching || !pagination.canFetchMore) return;

    dispatch(fetchGroupMembersBegin(groupId, status));

    if (search && search.length <= 1) search = undefined;

    const response = await requestBackend(
        `groups/${groupId}/members`,
        "GET",
        {page: pagination.page, limit: 50, statuses: [status], search},
        {},
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const members = (paginated.data as ResponseGroupMemberDto[]).map(convertDtoToGroupMember);
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        dispatch(fetchGroupMembersSuccess(groupId, members, canFetchMore, paginated.meta.totalItems, status, search));
    } else dispatch(fetchGroupMembersFailure(groupId, status));
};

const deleteGroupMemberSuccess = (
    groupId: string,
    profileId: string,
    isLocalUser: boolean,
): DeleteGroupMemberSuccessAction => ({
    type: GROUP_ACTION_TYPES.DELETE_GROUP_MEMBER_SUCCESS,
    groupId,
    profileId,
    isLocalUser,
});

export const deleteGroupMember = (groupId: string, profileId: string): AppThunk<Promise<boolean>> => async (
    dispatch,
    getState,
) => {
    const {
        auth: {token},
        profile: {user},
    } = getState();

    const response = await requestBackend(`groups/${groupId}/members/${profileId}`, "DELETE", {}, {}, token, true);

    if (response.status === HttpStatusCode.NO_CONTENT) {
        dispatch(deleteGroupMemberSuccess(groupId, profileId, profileId === user?.id));
        return true;
    } else {
        return false;
    }
};

const setGroupMemberStatusSuccess = (
    groupId: string,
    profileId: string,
    memberStatus: GroupMemberStatus,
    isLocalUser: boolean,
): SetGroupMemberStatusSuccessAction => ({
    type: GROUP_ACTION_TYPES.SET_GROUP_MEMBER_STATUS_SUCCESS,
    groupId,
    profileId,
    memberStatus,
    isLocalUser,
});

export const setGroupMemberStatus = (
    groupId: string,
    profileId: string,
    status: GroupMemberStatus,
): AppThunk<Promise<boolean>> => async (dispatch, getState) => {
    const {
        auth: {token},
        profile: {user},
    } = getState();

    const response = await requestBackend(`groups/${groupId}/members/${profileId}`, "PATCH", {}, {status}, token, true);

    if (response.status === HttpStatusCode.OK) {
        dispatch(setGroupMemberStatusSuccess(groupId, profileId, status, profileId === user?.id));
        return true;
    } else {
        return false;
    }
};

const setGroupMemberRoleSuccess = (
    groupId: string,
    profileId: string,
    role: GroupRole,
    isLocalUser: boolean,
): SetGroupMemberRoleSuccessAction => ({
    type: GROUP_ACTION_TYPES.SET_GROUP_MEMBER_ROLE_SUCCESS,
    groupId,
    profileId,
    role,
    isLocalUser,
});

export const setGroupMemberRole = (
    groupId: string,
    profileId: string,
    role: GroupRole,
): AppThunk<Promise<boolean>> => async (dispatch, getState) => {
    const {
        auth: {token},
        profile: {user},
    } = getState();

    const response = await requestBackend(`groups/${groupId}/members/${profileId}`, "PATCH", {}, {role}, token, true);

    if (response.status === HttpStatusCode.OK) {
        dispatch(setGroupMemberRoleSuccess(groupId, profileId, role, profileId === user?.id));
        return true;
    } else {
        return false;
    }
};

const inviteToGroupSuccess = (
    groupId: string,
    profile: UserProfile,
    memberStatus: GroupMemberStatus,
): InviteToGroupSuccessAction => ({
    type: GROUP_ACTION_TYPES.INVITE_TO_GROUP_SUCCESS,
    groupId,
    profile,
    memberStatus,
});

export const inviteToGroup = (groupId: string, profile: UserProfile): AppThunk<Promise<boolean>> => async (
    dispatch,
    getState,
) => {
    const {token} = getState().auth;

    /// Backend is responsible for assigning the right status
    const response = await requestBackend(
        `groups/${groupId}/members`,
        "POST",
        {},
        {profileId: profile.id},
        token,
        true,
    );

    if (response.status === HttpStatusCode.CREATED) {
        const payload = response as SuccessfulRequestResponse;
        const status = (payload.data as ResponseGroupMemberDto).status;
        dispatch(inviteToGroupSuccess(groupId, profile, status));
        return true;
    } else {
        return false;
    }
};

const beginFetchMyGroups = (invites: boolean): FetchMyGroupsBeginAction => ({
    type: GROUP_ACTION_TYPES.FETCH_MYGROUPS_BEGIN,
    invites,
});

const fetchMyGroupsSuccess = (items: Group[], canFetchMore: boolean, invites: boolean): FetchMyGroupsSuccessAction => ({
    type: GROUP_ACTION_TYPES.FETCH_MYGROUPS_SUCCESS,
    items,
    canFetchMore,
    invites,
});

const fetchMyGroupsFailure = (invites: boolean): FetchMyGroupsFailureAction => ({
    type: GROUP_ACTION_TYPES.FETCH_MYGROUPS_FAILURE,
    invites,
});

export const refreshFetchedMyGroups = (invites = false): FetchMyGroupsRefreshAction => ({
    type: GROUP_ACTION_TYPES.FETCH_MYGROUPS_REFRESH,
    invites,
});

export const fetchMyGroups = (invites = false): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        groups: {myGroupsPagination},
        profile: {user},
    } = getState();

    if (!token || !user) {
        dispatch(fetchMyGroupsFailure(invites));
        return;
    }

    if (myGroupsPagination.fetching || !myGroupsPagination.canFetchMore) return;

    dispatch(beginFetchMyGroups(invites));

    const response = await requestBackend(
        "groups",
        "GET",
        {
            page: myGroupsPagination.page,
            limit: GROUPS_FETCH_LIMIT,
            profileId: user.id,
            statuses: invites
                ? [GroupMemberStatus.Invited, GroupMemberStatus.InvitedByAdmin]
                : [GroupMemberStatus.Approved],
        },
        {},
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const groups = (paginated.data as ResponseGroupDto[]).map(convertDtoToGroup);
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        dispatch(fetchMyGroupsSuccess(groups, canFetchMore, invites));
    } else dispatch(fetchMyGroupsFailure(invites));
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

const createGroupPostBegin = (groupId: string): CreatePostBeginAction => ({
    type: GROUP_ACTION_TYPES.CREATE_POST_BEGIN,
    groupId,
});

const createGroupPostFailure = (): CreatePostFailureAction => ({
    type: GROUP_ACTION_TYPES.CREATE_POST_FAILURE,
});

const createGroupPostSuccess = (groupId: string, post: GroupPost): CreatePostSuccessAction => ({
    type: GROUP_ACTION_TYPES.CREATE_POST_SUCCESS,
    groupId,
    post,
});

export const createGroupPost = (groupId: string, dto: CreateGroupPostDto): ValidatedThunkAction => async (
    dispatch,
    getState,
) => {
    const {token} = getState().auth;

    if (!token) return {success: false};

    dispatch(createGroupPostBegin(groupId));

    const response = await requestBackend(`groups/${groupId}/posts`, "POST", {}, dto, token, true);

    if (response.status === HttpStatusCode.CREATED) {
        const payload = (response as SuccessfulRequestResponse).data;
        const post = convertDtoToGroupPost(payload as ResponseGroupPostDto, getState().profile.user?.profile);
        dispatch(createGroupPostSuccess(groupId, post));
        return {success: true};
    } else {
        dispatch(createGroupPostFailure());
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

const updateGroupPostSuccess = (groupId: string, post: GroupPost): UpdatePostSuccessAction => ({
    type: GROUP_ACTION_TYPES.UPDATE_POST_SUCCESS,
    groupId,
    post,
});

export const updateGroupPost = (
    groupId: string,
    postId: string,
    dto: Partial<CreateGroupPostDto>,
): ValidatedThunkAction => async (dispatch, getState) => {
    const {token} = getState().auth;

    if (!token) return {success: false};

    const response = await requestBackend(`groups/${groupId}/posts/${postId}`, "PATCH", {}, dto, token, true);

    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data as ResponseGroupPostDto;
        const post = convertDtoToGroupPost(payload, getState().profile.user?.profile);
        dispatch(updateGroupPostSuccess(groupId, post));
        return {success: true};
    } else {
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

const deletePostSuccess = (groupId: string, postId: string): DeletePostSuccessAction => ({
    type: GROUP_ACTION_TYPES.DELETE_POST_SUCCESS,
    groupId,
    postId,
});

export const deleteGroupPost = (groupId: string, postId: string): ValidatedThunkAction => async (
    dispatch,
    getState,
) => {
    const {token} = getState().auth;

    if (!token) return {success: false};

    const response = await requestBackend(`groups/${groupId}/posts/${postId}`, "DELETE", {}, {}, token, true);

    if (response.status === HttpStatusCode.NO_CONTENT) {
        dispatch(deletePostSuccess(groupId, postId));
        return {success: true};
    } else {
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

const createPostCommentBegin = (groupId: string, postId: string): CreateCommentBeginAction => ({
    type: GROUP_ACTION_TYPES.CREATE_COMMENT_BEGIN,
    groupId,
    postId,
});

const createPostCommentFailure = (): CreateCommentFailureAction => ({
    type: GROUP_ACTION_TYPES.CREATE_COMMENT_FAILURE,
});

const createPostCommentSuccess = (
    groupId: string,
    postId: string,
    comment: PostComment,
    parentId: string | null,
): CreateCommentSuccessAction => ({
    type: GROUP_ACTION_TYPES.CREATE_COMMENT_SUCCESS,
    groupId,
    postId,
    comment,
    parentId,
});

export const createPostComment = (
    groupId: string,
    postId: string,
    dto: CreatePostCommentDto,
): ValidatedThunkAction => async (dispatch, getState) => {
    const {
        auth: {token},
        groups,
    } = getState();

    if (!token) return {success: false};

    dispatch(createPostCommentBegin(groupId, postId));

    let depth = 0;

    if (dto.parentId) {
        // Try to get the parent post and comment from storage (from its group or from the feed)
        const parent = findComment(groups, groupId, postId, dto.parentId);
        if (parent) depth = parent.depth + 1;
    }

    const response = await requestBackend(`groups/${groupId}/posts/${postId}/comments`, "POST", {}, dto, token, true);

    if (response.status === HttpStatusCode.CREATED) {
        const payload = response as SuccessfulRequestResponse;
        const comment = convertDtoToPostComments(
            payload.data as ResponsePostCommentDto,
            dto.parentId || null,
            depth,
            getState().profile.user?.profile,
        )[0]; // no children yet => we can safely just get the first and only comment
        dispatch(createPostCommentSuccess(groupId, postId, comment, dto.parentId || null));
        return {success: true};
    } else {
        dispatch(createPostCommentFailure());
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

const updatePostCommentSuccess = (
    groupId: string,
    postId: string,
    comments: PostComment[],
): UpdateCommentSuccessAction => ({
    type: GROUP_ACTION_TYPES.UPDATE_COMMENT_SUCCESS,
    groupId,
    postId,
    comments,
});

export const updatePostComment = (
    groupId: string,
    postId: string,
    commentId: string,
    dto: Partial<CreatePostCommentDto>,
): ValidatedThunkAction => async (dispatch, getState) => {
    const {
        auth: {token},
        groups,
    } = getState();

    if (!token) return {success: false};

    const response = await requestBackend(
        `groups/${groupId}/posts/${postId}/comments/${commentId}`,
        "PATCH",
        {},
        dto,
        token,
        true,
    );

    const comment = findComment(groups, groupId, postId, commentId);

    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data as ResponsePostCommentDto;
        // Can include children
        const comments = convertDtoToPostComments(
            payload,
            comment?.parentId,
            comment?.depth,
            getState().profile.user?.profile,
        );
        dispatch(updatePostCommentSuccess(groupId, postId, comments));
        return {success: true};
    } else {
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

const deletePostCommentSuccess = (groupId: string, postId: string, commentId: string): DeleteCommentSuccessAction => ({
    type: GROUP_ACTION_TYPES.DELETE_COMMENT_SUCCESS,
    groupId,
    postId,
    commentId,
});

export const deletePostComment = (groupId: string, postId: string, commentId: string): ValidatedThunkAction => async (
    dispatch,
    getState,
) => {
    const {token} = getState().auth;

    if (!token) return {success: false};

    const response = await requestBackend(
        `groups/${groupId}/posts/${postId}/comments/${commentId}`,
        "DELETE",
        {},
        {},
        token,
        true,
    );

    if (response.status === HttpStatusCode.NO_CONTENT) {
        dispatch(deletePostCommentSuccess(groupId, postId, commentId));
        return {success: true};
    } else {
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

const setGroupCoverBegin = (groupId: string): SetGroupCoverBeginAction => ({
    type: GROUP_ACTION_TYPES.SET_COVER_BEGIN,
    groupId,
});

const setGroupCoverSuccess = (groupId: string, url: string): SetGroupCoverSuccessAction => ({
    type: GROUP_ACTION_TYPES.SET_COVER_SUCCESS,
    groupId,
    url,
});

const setGroupCoverFailure = (groupId: string): SetGroupCoverFailureAction => ({
    type: GROUP_ACTION_TYPES.SET_COVER_FAILURE,
    groupId,
});

export const setGroupCover = (groupId: string, image: ImageInfo): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        profile: {uploadingAvatar},
    } = getState();

    const fail = () => dispatch(setGroupCoverFailure(groupId));

    if (!token || uploadingAvatar) {
        fail();
        return;
    }

    dispatch(setGroupCoverBegin(groupId));

    const fileName = await uploadImage(token, image, fail);

    if (fileName) {
        // Submit the filename to the server
        const response = await requestBackend(`groups/${groupId}/cover`, "POST", {}, {fileName}, token, true);

        if (response.status === HttpStatusCode.CREATED) {
            const {cover} = (response as SuccessfulRequestResponse).data as GroupCoverSuccessfullyUpdatedDto;
            dispatch(setGroupCoverSuccess(groupId, cover));
        } else fail();
    }
};

export const setPostSortingOrder = (order: PostSortingOrder): SetPostSortingOrderAction => ({
    type: GROUP_ACTION_TYPES.SET_POST_SORTING_ORDER,
    order,
});

const setPostVoteBegin = (groupId: string, postId: string, status: GroupVoteStatus): SetPostVoteBeginAction => ({
    type: GROUP_ACTION_TYPES.SET_POST_VOTE_BEGIN,
    groupId,
    postId,
    status,
});

const setPostVoteSuccess = (groupId: string, postId: string, status: GroupVoteStatus): SetPostVoteSuccessAction => ({
    type: GROUP_ACTION_TYPES.SET_POST_VOTE_SUCCESS,
    groupId,
    postId,
    status,
});

const setCommentVoteBegin = (
    groupId: string,
    postId: string,
    commentId: string,
    status: GroupVoteStatus,
): SetCommentVoteBeginAction => ({
    type: GROUP_ACTION_TYPES.SET_COMMENT_VOTE_BEGIN,
    groupId,
    postId,
    commentId,
    status,
});

const setCommentVoteSuccess = (
    groupId: string,
    postId: string,
    commentId: string,
    status: GroupVoteStatus,
): SetCommentVoteSuccessAction => ({
    type: GROUP_ACTION_TYPES.SET_COMMENT_VOTE_SUCCESS,
    groupId,
    postId,
    commentId,
    status,
});

export const setVote = (
    groupId: string,
    postId: string,
    commentId: string | null,
    status: GroupVoteStatus,
    currentStatus: GroupVoteStatus,
): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
    } = getState();

    const entityId = commentId || postId;
    const isComment = commentId !== null;
    const entityType = isComment ? "comment" : "post";
    const url = `groups/${groupId}/votes/${entityType}/${entityId}`;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (isComment) dispatch(setCommentVoteBegin(groupId, postId, commentId!, status));
    else dispatch(setPostVoteBegin(groupId, postId, status));

    const response =
        status === GroupVoteStatus.Neutral
            ? // If setting to neutral, simply DELETE the entity
              await requestBackend(url, "DELETE", {}, {}, token, true)
            : currentStatus === GroupVoteStatus.Neutral
            ? // If currently neutral, POST a new entity
              await requestBackend(url, "POST", {}, {voteType: status}, token, true)
            : // If already set, PATCH the entity
              await requestBackend(url, "PATCH", {}, {voteType: status}, token, true);

    if (response.status === HttpStatusCode.OK) {
        if (commentId) dispatch(setCommentVoteSuccess(groupId, postId, commentId, status));
        else dispatch(setPostVoteSuccess(groupId, postId, status));
    }
};

const fetchAvailableMatchesBegin = (groupId: string): FetchAvailableMatchesBeginAction => ({
    type: GROUP_ACTION_TYPES.FETCH_AVAILABLE_MATCHES_BEGIN,
    groupId,
});

const fetchAvailableMatchesSuccess = (groupId: string, items: UserProfile[]): FetchAvailableMatchesSuccessAction => ({
    type: GROUP_ACTION_TYPES.FETCH_AVAILABLE_MATCHES_SUCCESS,
    groupId,
    items,
});

const fetchAvailableMatchesFailure = (groupId: string): FetchAvailableMatchesFailureAction => ({
    type: GROUP_ACTION_TYPES.FETCH_AVAILABLE_MATCHES_FAILURE,
    groupId,
});

export const fetchAvailableMatches = (groupId: string): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        groups: {groupsDict},
    } = getState();

    const g = groupsDict[groupId];

    if (!g || g.availableMatches.fetching) return;

    dispatch(fetchAvailableMatchesBegin(groupId));

    const response = await requestBackend(`groups/${groupId}/availableMatches`, "GET", {}, {}, token, true);

    // TODO remove 201
    if (response.status === HttpStatusCode.OK || response.status === 201) {
        const payload = response as SuccessfulRequestResponse;
        const profiles = (payload.data as ResponseProfileDto[]).map(convertDtoToProfile);
        dispatch(fetchAvailableMatchesSuccess(groupId, profiles));
    } else dispatch(fetchAvailableMatchesFailure(groupId));
};
