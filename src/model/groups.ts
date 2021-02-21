import {GroupMemberStatus, GroupRole} from "../api/dto";
import {PaginatedState} from "../state/types";
import {UserProfile} from "./user-profile";

export type Group = {
    id: string;
    name: string;
    description: string;
    visible: boolean;
    requireApproval: boolean;
    cover: string | null;
    uploadingCover: boolean;
    members: {[key: string]: GroupMember};
    membersPaginations: {[key in GroupMemberStatus]: PaginatedState};
    memberIds: {[key in GroupMemberStatus]: string[]};
    posts: {[key: string]: GroupPost};
    postIds: string[];
    postsPagination: PaginatedState;
    myRole: GroupRole | null;
    numApprovedMembers: number | null;
};

export type GroupMember = {
    profile: UserProfile;
    role: GroupRole;
    status: GroupMemberStatus;
};

export type GroupPost = {
    id: string;
    groupId: string;
    type: string;
    status: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    creator: UserProfile;
    score: number;
    voteStatus: GroupVoteStatus;
    comments: {[key: string]: PostComment};
    commentsCount: number;
    commentIds: string[];
    commentsPagination: PaginatedState;
};

export type PostComment = {
    id: string;
    text: string;
    score: number;
    voteStatus: GroupVoteStatus;
    creator: UserProfile;
    createdAt: Date;
    updatedAt: Date;
    children: PostComment[];
};

export enum PostSortingOrder {
    Newest = "newest",
    Oldest = "oldest",
    Popular = "popular",
}

export const POST_SORTING_ORDERS = [PostSortingOrder.Newest, PostSortingOrder.Oldest, PostSortingOrder.Popular];

export enum GroupVoteStatus {
    Upvote = "up",
    Downvote = "down",
    Neutral = "neutral",
}
export const GROUP_VOTE_VALUES = {
    [GroupVoteStatus.Upvote]: 1,
    [GroupVoteStatus.Downvote]: -1,
    [GroupVoteStatus.Neutral]: 0,
};
