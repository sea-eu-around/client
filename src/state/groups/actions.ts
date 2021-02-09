import {requestBackend} from "../../api/utils";
import {AppThunk, ValidatedThunkAction} from "../types";
import {HttpStatusCode} from "../../constants/http-status";
import {GROUPS_FETCH_LIMIT} from "../../constants/config";
import {
    CreateGroupDto,
    CreateGroupPostDto,
    CreatePostCommentDto,
    GroupCoverSuccessfullyUpdatedDto,
    PaginatedRequestResponse,
    ResponseGroupDto,
    ResponseGroupMemberDto,
    ResponseGroupPostDto,
    ResponsePostCommentDto,
    SuccessfulRequestResponse,
} from "../../api/dto";
import {Group, GroupMember, GroupPost, PostComment} from "../../model/groups";
import {
    convertDtoToGroup,
    convertDtoToGroupMember,
    convertDtoToGroupPost,
    convertDtoToPostComment,
} from "../../api/converters";
import {gatherValidationErrors} from "../../api/errors";
import {ImageInfo} from "expo-image-picker/build/ImagePicker.types";
import {uploadImage} from "../../api/media-upload";

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
    FETCH_GROUP_MEMBERS_BEGIN = "GROUP/FETCH_GROUP_MEMBERS_BEGIN",
    FETCH_GROUP_MEMBERS_SUCCESS = "GROUP/FETCH_GROUP_MEMBERS_SUCCESS",
    FETCH_GROUP_MEMBERS_FAILURE = "GROUP/FETCH_GROUP_MEMBERS_FAILURE",
    FETCH_GROUP_POSTS_BEGIN = "GROUP/FETCH_GROUP_POSTS_BEGIN",
    FETCH_GROUP_POSTS_SUCCESS = "GROUP/FETCH_GROUP_POSTS_SUCCESS",
    FETCH_GROUP_POSTS_FAILURE = "GROUP/FETCH_GROUP_POSTS_FAILURE",
    FETCH_GROUP_POSTS_REFRESH = "GROUP/FETCH_GROUP_POSTS_REFRESH",
    FETCH_POST_COMMENTS_BEGIN = "GROUP/FETCH_POST_COMMENTS_BEGIN",
    FETCH_POST_COMMENTS_SUCCESS = "GROUP/FETCH_POST_COMMENTS_SUCCESS",
    FETCH_POST_COMMENTS_FAILURE = "GROUP/FETCH_POST_COMMENTS_FAILURE",
    FETCH_MYGROUPS_BEGIN = "GROUP/FETCH_MYGROUPS_BEGIN",
    FETCH_MYGROUPS_FAILURE = "GROUP/FETCH_MYGROUPS_FAILURE",
    FETCH_MYGROUPS_SUCCESS = "GROUP/FETCH_MYGROUPS_SUCCESS",
    FETCH_MYGROUPS_REFRESH = "GROUP/FETCH_MYGROUPS_REFRESH",
    JOIN_GROUP_SUCCESS = "GROUP/JOIN_GROUP_SUCCESS",
    CREATE_POST_BEGIN = "GROUP/CREATE_POST_BEGIN",
    CREATE_POST_SUCCESS = "GROUP/CREATE_POST_SUCCESS",
    CREATE_POST_FAILURE = "GROUP/CREATE_POST_FAILURE",
    UPDATE_POST_SUCCESS = "GROUP/UPDATE_POST_SUCCESS",
    CREATE_COMMENT_BEGIN = "GROUP/CREATE_COMMENT_BEGIN",
    CREATE_COMMENT_SUCCESS = "GROUP/CREATE_COMMENT_SUCCESS",
    CREATE_COMMENT_FAILURE = "GROUP/CREATE_COMMENT_FAILURE",
    UPDATE_COMMENT_SUCCESS = "GROUP/UPDATE_COMMENT_SUCCESS",
    SET_COVER_BEGIN = "GROUP/SET_COVER_BEGIN",
    SET_COVER_SUCCESS = "GROUP/SET_COVER_SUCCESS",
    SET_COVER_FAILURE = "GROUP/SET_COVER_FAILURE",
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

export type FetchGroupMembersBeginAction = {
    type: string;
    groupId: string;
};

export type FetchGroupMembersSuccessAction = {
    type: string;
    groupId: string;
    members: GroupMember[];
    canFetchMore: boolean;
};

export type FetchGroupMembersFailureAction = {
    type: string;
    groupId: string;
};

export type FetchGroupPostsBeginAction = {
    type: string;
    groupId: string;
};

export type FetchGroupPostsSuccessAction = {
    type: string;
    groupId: string;
    posts: GroupPost[];
    canFetchMore: boolean;
};

export type FetchGroupPostsRefreshAction = {
    type: string;
    groupId: string;
};

export type FetchGroupPostsFailureAction = {
    type: string;
    groupId: string;
};

export type FetchPostCommentsBeginAction = {
    type: string;
    groupId: string;
    postId: string;
};

export type FetchPostCommentsSuccessAction = {
    type: string;
    groupId: string;
    postId: string;
    comments: PostComment[];
    canFetchMore: boolean;
};

export type FetchPostCommentsFailureAction = {
    type: string;
    groupId: string;
    postId: string;
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
    post: GroupPost;
};

export type CreatePostFailureAction = {
    type: string;
};

export type UpdatePostSuccessAction = {
    type: string;
    groupId: string;
    post: GroupPost;
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
};

export type CreateCommentFailureAction = {
    type: string;
};

export type UpdateCommentSuccessAction = {
    type: string;
    groupId: string;
    postId: string;
    comment: PostComment;
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

export type GroupsAction = CreateGroupSuccessAction &
    CreateGroupFailureAction &
    UpdateGroupSuccessAction &
    UpdateGroupFailureAction &
    BeginFetchGroupsAction &
    FetchGroupsFailureAction &
    FetchGroupsSuccessAction &
    FetchGroupsRefreshAction &
    FetchGroupMembersBeginAction &
    FetchGroupMembersFailureAction &
    FetchGroupMembersSuccessAction &
    FetchGroupPostsBeginAction &
    FetchGroupPostsFailureAction &
    FetchGroupPostsSuccessAction &
    FetchGroupPostsRefreshAction &
    FetchPostCommentsBeginAction &
    FetchPostCommentsFailureAction &
    FetchPostCommentsSuccessAction &
    JoinGroupSuccessAction &
    CreatePostBeginAction &
    CreatePostFailureAction &
    CreatePostSuccessAction &
    UpdatePostSuccessAction &
    CreateCommentBeginAction &
    CreateCommentFailureAction &
    CreateCommentSuccessAction &
    UpdateCommentSuccessAction &
    SetGroupCoverBeginAction &
    SetGroupCoverFailureAction &
    SetGroupCoverSuccessAction;

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

const fetchGroupPostsBegin = (groupId: string): FetchGroupPostsBeginAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_BEGIN,
    groupId,
});

const fetchGroupPostsSuccess = (
    groupId: string,
    posts: GroupPost[],
    canFetchMore: boolean,
): FetchGroupPostsSuccessAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_POSTS_SUCCESS,
    groupId,
    posts,
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
        groups: {groupsDict},
    } = getState();

    const g = groupsDict[groupId];

    if (!g || g.postsPagination.fetching || !g.postsPagination.canFetchMore) return;

    dispatch(fetchGroupPostsBegin(groupId));

    const response = await requestBackend(
        `groups/${groupId}/posts`,
        "GET",
        {page: g.postsPagination.page, limit: 50},
        {},
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const posts = (paginated.data as ResponseGroupPostDto[]).map(convertDtoToGroupPost);
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
    comments: PostComment[],
    canFetchMore: boolean,
): FetchPostCommentsSuccessAction => ({
    type: GROUP_ACTION_TYPES.FETCH_POST_COMMENTS_SUCCESS,
    groupId,
    postId,
    comments,
    canFetchMore,
});

const fetchPostCommentsFailure = (groupId: string, postId: string): FetchPostCommentsFailureAction => ({
    type: GROUP_ACTION_TYPES.FETCH_POST_COMMENTS_FAILURE,
    groupId,
    postId,
});

export const fetchPostComments = (groupId: string, postId: string): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        groups: {groupsDict},
    } = getState();

    const g = groupsDict[groupId];

    if (!g) return;

    const p = g.posts[postId];

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
        const comments = (paginated.data as ResponsePostCommentDto[]).map(convertDtoToPostComment);
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        dispatch(fetchPostCommentsSuccess(groupId, postId, comments, canFetchMore));
    } else dispatch(fetchPostCommentsFailure(groupId, postId));
};

const fetchGroupMembersBegin = (groupId: string): FetchGroupMembersBeginAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_BEGIN,
    groupId,
});

const fetchGroupMembersSuccess = (
    groupId: string,
    members: GroupMember[],
    canFetchMore: boolean,
): FetchGroupMembersSuccessAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_SUCCESS,
    groupId,
    members,
    canFetchMore,
});

const fetchGroupMembersFailure = (groupId: string): FetchGroupMembersFailureAction => ({
    type: GROUP_ACTION_TYPES.FETCH_GROUP_MEMBERS_FAILURE,
    groupId,
});

export const fetchGroupMembers = (groupId: string): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        groups: {groupsDict},
    } = getState();

    const g = groupsDict[groupId];

    if (!g || g.membersPagination.fetching || !g.membersPagination.canFetchMore) return;

    dispatch(fetchGroupMembersBegin(groupId));

    const response = await requestBackend(
        `groups/${groupId}/members`,
        "GET",
        {page: g.membersPagination.page, limit: 50},
        {},
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const members = (paginated.data as ResponseGroupMemberDto[]).map(convertDtoToGroupMember);
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        dispatch(fetchGroupMembersSuccess(groupId, members, canFetchMore));
    } else dispatch(fetchGroupMembersFailure(groupId));
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

const createGroupPostSuccess = (group: Group, post: GroupPost): CreatePostSuccessAction => ({
    type: GROUP_ACTION_TYPES.CREATE_POST_SUCCESS,
    group,
    post,
});

export const createGroupPost = (group: Group, dto: CreateGroupPostDto): ValidatedThunkAction => async (
    dispatch,
    getState,
) => {
    const {token} = getState().auth;

    if (!token) return {success: false};

    dispatch(createGroupPostBegin(group));

    const response = await requestBackend(`groups/${group.id}/posts`, "POST", {}, dto, token, true);

    if (response.status === HttpStatusCode.CREATED) {
        const payload = (response as SuccessfulRequestResponse).data;
        const post = convertDtoToGroupPost(payload as ResponseGroupPostDto);
        dispatch(createGroupPostSuccess(group, post));
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
        const post = convertDtoToGroupPost(payload);
        dispatch(updateGroupPostSuccess(groupId, post));
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

const createPostCommentSuccess = (groupId: string, postId: string): CreateCommentSuccessAction => ({
    type: GROUP_ACTION_TYPES.CREATE_COMMENT_SUCCESS,
    groupId,
    postId,
});

export const createPostComment = (
    groupId: string,
    postId: string,
    dto: CreatePostCommentDto,
): ValidatedThunkAction => async (dispatch, getState) => {
    const {token} = getState().auth;

    if (!token) return {success: false};

    dispatch(createPostCommentBegin(groupId, postId));

    const response = await requestBackend(`groups/${groupId}/posts/${postId}/comments`, "POST", {}, dto, token, true);

    if (response.status === HttpStatusCode.CREATED) {
        dispatch(createPostCommentSuccess(groupId, postId));
        return {success: true};
    } else {
        dispatch(createPostCommentFailure());
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

const updatePostCommentSuccess = (
    groupId: string,
    postId: string,
    comment: PostComment,
): UpdateCommentSuccessAction => ({
    type: GROUP_ACTION_TYPES.UPDATE_COMMENT_SUCCESS,
    groupId,
    postId,
    comment,
});

export const updatePostComment = (
    groupId: string,
    postId: string,
    commentId: string,
    dto: Partial<CreatePostCommentDto>,
): ValidatedThunkAction => async (dispatch, getState) => {
    const {token} = getState().auth;

    if (!token) return {success: false};

    const response = await requestBackend(
        `groups/${groupId}/posts/${postId}/comments/${commentId}`,
        "PATCH",
        {},
        dto,
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data as ResponsePostCommentDto;
        const comment = convertDtoToPostComment(payload);
        dispatch(updatePostCommentSuccess(groupId, postId, comment));
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
