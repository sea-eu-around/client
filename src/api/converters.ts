import {
    ChatRoomProfileDto,
    CreateProfileDto,
    CreateProfileDtoCommon,
    EducationFieldDto,
    MatchHistoryItemDto,
    OfferValueDto,
    ResponseChatMessageDto,
    ResponseProfileDto,
    ResponseProfileDtoStaff,
    ResponseProfileDtoStudent,
    ResponseRoomDto,
    ResponseUserDto,
    ResponseProfileWithMatchInfoDto,
    ResponseGroupDto,
    ResponseGroupMemberDto,
    ResponseGroupPostDto,
    ResponsePostCommentDto,
} from "./dto";
import {
    UserProfile,
    UserProfileCommon,
    UserProfileStaff,
    UserProfileStudent,
    UserProfileWithMatchInfo,
} from "../model/user-profile";
import {User} from "../model/user";
import {ChatRoom, ChatRoomMessage, ChatRoomUser} from "../model/chat-room";
import {initialPaginatedState} from "../state/types";
import {Role, StaffRole} from "../constants/profile-constants";
import {MatchHistoryItem} from "../model/matching";
import {PARTNER_UNIVERSITIES} from "../constants/universities";
import {Group, GroupMember, GroupPost, PostComment, GroupVoteStatus} from "../model/groups";

export function stripSuperfluousOffers(offers: OfferValueDto[]): OfferValueDto[] {
    return offers
        ? offers.filter((o) => o.allowFemale || o.allowMale || o.allowOther || o.allowStaff || o.allowStudent)
        : [];
}

export function convertDtoToProfile(dto: ResponseProfileDto): UserProfile {
    const common: UserProfileCommon = {
        ...dto,
        avatarUrl: dto.avatar,
        birthdate: new Date(dto.birthdate),
        educationFields: (dto.educationFields || []).map((dto: EducationFieldDto) => dto.id),
        profileOffers: dto.profileOffers || [],
        interests: (dto.interests || []).map((i) => i.id),
        languages: dto.languages || [],
        university: PARTNER_UNIVERSITIES.find((u) => u.key === dto.university) || PARTNER_UNIVERSITIES[0],
    };

    let complete: UserProfile;
    if (dto.type === "staff") {
        const staffDto = dto as ResponseProfileDtoStaff;
        complete = {...common, staffRoles: (staffDto.staffRoles || []).map((r) => r.id as StaffRole)};
    } else {
        const studentDto = dto as ResponseProfileDtoStudent;
        complete = {...common, degree: studentDto.degree};
    }

    return complete;
}

export function convertProfileToCreateDto(profile: UserProfile): CreateProfileDto {
    const common: CreateProfileDtoCommon = {
        ...profile,
        birthdate: profile.birthdate.toJSON(),
        educationFields: profile.educationFields.map((id: string) => ({id})),
        interests: profile.interests.map((id: string) => ({id})),
        profileOffers: stripSuperfluousOffers(profile.profileOffers),
    };

    let complete: CreateProfileDto;
    if (profile.type === "staff") {
        const staff = profile as UserProfileStaff;
        complete = {...common, staffRoles: staff.staffRoles.map((id: string) => ({id}))};
    } else {
        const student = profile as UserProfileStudent;
        complete = {...common, degree: student.degree};
    }

    return complete;
}

export function convertPartialProfileToCreateDto(
    profile: Partial<UserProfile>,
    type?: Role,
): Partial<CreateProfileDto> {
    const common: Partial<CreateProfileDtoCommon> = {
        ...profile,
        type,
        birthdate: profile.birthdate?.toJSON(),
        educationFields: profile.educationFields?.map((id: string) => ({id})),
        interests: profile.interests?.map((id: string) => ({id})),
        profileOffers: profile.profileOffers ? stripSuperfluousOffers(profile.profileOffers) : undefined,
    };

    let complete: Partial<CreateProfileDto>;
    if (type === "staff") {
        const staff = profile as Partial<UserProfileStaff>;
        complete = {...common, staffRoles: staff.staffRoles ? staff.staffRoles.map((id: string) => ({id})) : undefined};
    } else {
        const student = profile as Partial<UserProfileStudent>;
        complete = {...common, degree: student.degree};
    }

    return complete;
}

export function convertDtoToUser(dto: ResponseUserDto): User {
    return {
        ...dto,
        profile: dto.profile ? convertDtoToProfile(dto.profile) : undefined,
    };
}

export function convertDtoToRoom(dto: ResponseRoomDto): ChatRoom {
    const users: ChatRoomUser[] = dto.profiles.map((p: ChatRoomProfileDto) => ({
        _id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        avatar: p.avatar || "",
        lastMessageSeenId: p.lastMessageSeenId,
        lastMessageSeenDate: p.lastMessageSeenDate ? new Date(p.lastMessageSeenDate) : null,
    }));

    // Try to find the sender of the last message in the list of users that are in the room
    let lastMessage = null;
    if (dto.lastMessage) {
        const msg: ResponseChatMessageDto = dto.lastMessage;
        const sender = users.find((u) => u._id == msg.senderId);
        if (sender) lastMessage = convertDtoToChatMessage(sender, msg);
    }

    return {
        ...dto,
        users,
        messages: [],
        lastMessage,
        writing: {},
        messagePagination: initialPaginatedState(),
    };
}

export function convertDtoToChatMessage(user: ChatRoomUser, dto: ResponseChatMessageDto): ChatRoomMessage {
    return {
        ...dto,
        _id: dto.id,
        createdAt: new Date(dto.updatedAt),
        user,
    };
}

export function convertDtoToHistoryItem(dto: MatchHistoryItemDto): MatchHistoryItem {
    return {
        profile: convertDtoToProfile(dto.profile),
        status: dto.status,
        date: new Date(dto.date),
        id: dto.id,
    };
}

export function convertDtoToProfileWithMatchInfo(dto: ResponseProfileWithMatchInfoDto): UserProfileWithMatchInfo {
    return {...dto, profile: convertDtoToProfile(dto.profile)};
}

export function convertDtoToGroup(dto: ResponseGroupDto): Group {
    return {
        ...dto,
        description: dto.description || "",
        membersPaginations: {
            approved: initialPaginatedState(),
            banned: initialPaginatedState(),
            pending: initialPaginatedState(),
            "invited-by-admin": initialPaginatedState(),
            invited: initialPaginatedState(),
        },
        memberIds: {
            approved: [],
            banned: [],
            pending: [],
            "invited-by-admin": [],
            invited: [],
        },
        members: {},
        posts: {},
        postIds: [],
        postsPagination: initialPaginatedState(),
        uploadingCover: false,
        myRole: dto.isMember ? dto.role : null,
        myStatus: dto.status || null,
        numApprovedMembers: null,
        availableMatches: {
            fetching: false,
            profiles: null,
        },
    };
}

export function convertDtoToGroupMember(dto: ResponseGroupMemberDto): GroupMember {
    return {...dto, profile: convertDtoToProfile(dto.profile)};
}

export function convertDtoToGroupPost(dto: ResponseGroupPostDto, creator?: UserProfile): GroupPost {
    return {
        ...dto,
        comments: {},
        commentIds: [],
        commentsPagination: initialPaginatedState(),
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
        creator: creator && !dto.creator ? creator : convertDtoToProfile(dto.creator),
        score: dto.upVotesCount - dto.downVotesCount,
        voteStatus: dto.isVoted
            ? dto.voteType === "up"
                ? GroupVoteStatus.Upvote
                : dto.voteType === "down"
                ? GroupVoteStatus.Downvote
                : GroupVoteStatus.Neutral
            : GroupVoteStatus.Neutral,
    };
}

export function convertDtoToPostComments(
    dto: ResponsePostCommentDto,
    parentId: string | null = null,
    depth = 0,
    creator?: UserProfile,
): PostComment[] {
    const comment: PostComment = {
        id: dto.id,
        text: dto.text,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
        creator: creator && !dto.creator ? creator : convertDtoToProfile(dto.creator),
        score: dto.upVotesCount - dto.downVotesCount,
        voteStatus: dto.isVoted
            ? dto.voteType === "up"
                ? GroupVoteStatus.Upvote
                : dto.voteType === "down"
                ? GroupVoteStatus.Downvote
                : GroupVoteStatus.Neutral
            : GroupVoteStatus.Neutral,
        childrenIds: dto.children?.map((c) => c.id) || [],
        parentId,
        depth,
    };

    if (dto.children && dto.children.length > 0) {
        // Get all children, including nested
        const allChildren = dto.children.flatMap((childDto) =>
            convertDtoToPostComments(childDto, comment.id, depth + 1, creator),
        );
        return [comment].concat(allChildren);
    } else return [comment];
}
