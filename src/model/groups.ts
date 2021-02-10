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
    type: string;
    status: string;
    text: string;
    creator: UserProfile;
    comments: {[key: string]: PostComment};
    commentIds: string[];
    commentsPagination: PaginatedState;
};

export type PostComment = {
    id: string;
    text: string;
    creator: UserProfile;
};
