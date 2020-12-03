import {
    ChatRoomProfileDto,
    CreateProfileDto,
    CreateProfileDtoCommon,
    EducationFieldDto,
    OfferValueDto,
    ResponseChatMessageDto,
    ResponseProfileDto,
    ResponseRoomDto,
    ResponseUserDto,
} from "./dto";
import {UserProfile} from "../model/user-profile";
import {User} from "../model/user";
import {ChatRoom, ChatRoomMessage, ChatRoomUser} from "../model/chat-room";

export function stripSuperfluousOffers(offers: OfferValueDto[]): OfferValueDto[] {
    return offers
        ? offers.filter((o) => o.allowFemale || o.allowMale || o.allowOther || o.allowStaff || o.allowStudent)
        : [];
}

export function convertDtoToProfile(dto: ResponseProfileDto): UserProfile {
    return {
        ...dto,
        avatarUrl: dto.avatar,
        birthdate: new Date(dto.birthdate),
        educationFields: (dto.educationFields || []).map((dto: EducationFieldDto) => dto.id),
        profileOffers: dto.profileOffers || [],
        interests: (dto.interests || []).map((i) => i.id),
        languages: dto.languages || [],
    };
}

export function convertProfileToCreateDto(profile: UserProfile): CreateProfileDto {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const common: CreateProfileDtoCommon = {
        ...profile,
        birthdate: profile.birthdate.toJSON(),
        educationFields: profile.educationFields.map((id: string) => ({id})),
        interests: profile.interests.map((id: string) => ({id})),
        profileOffers: stripSuperfluousOffers(profile.profileOffers),
    };

    return {...common, ...(profile.type == "staff" ? {staffRole: profile.staffRole!} : {degree: profile.degree!})};
}

export function convertPartialProfileToCreateDto(profile: Partial<UserProfile>): Partial<CreateProfileDto> {
    return {
        ...profile,
        birthdate: profile.birthdate?.toJSON(),
        educationFields: profile.educationFields?.map((id: string) => ({id})),
        profileOffers: profile.profileOffers ? stripSuperfluousOffers(profile.profileOffers) : undefined,
        interests: profile.interests?.map((id: string) => ({id})),
    };
}

export function convertDtoToUser(dto: ResponseUserDto): User {
    return {
        ...dto,
        profile: dto.profile ? convertDtoToProfile(dto.profile) : undefined,
    };
}

export function convertDtoToRoom(dto: ResponseRoomDto): ChatRoom {
    const users = dto.profiles.map((p: ChatRoomProfileDto) => ({
        _id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        avatar: p.avatar || "",
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
