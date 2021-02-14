import {GroupRoleDto} from "../api/dto";
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
    members: GroupMember[] | null;
    membersPagination: PaginatedState;
    posts: {[key: string]: GroupPost};
    postIds: string[];
    postsPagination: PaginatedState;
};

export type GroupMember = {
    profile: UserProfile;
    role: GroupRoleDto;
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
};

export enum PostSortingOrder {
    Newest = "newest",
    Oldest = "oldest",
    MostPopular = "most-popular",
}

export const POST_SORTING_ORDERS = [PostSortingOrder.Newest, PostSortingOrder.Oldest, PostSortingOrder.MostPopular];

export enum GroupVoteStatus {
    Upvote = "up",
    Downvote = "down",
    Neutral = "neutral",
}
