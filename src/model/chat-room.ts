import {PaginatedState} from "../state/types";

export type ChatRoomUser = {
    _id: string;
    name: string;
    avatar: string;
    lastMessageSeenDate: Date | null;
};

export type ChatRoomMessage = {
    _id: string;
    text: string;
    createdAt: Date;
    user: ChatRoomUser;
    sent: boolean;
};

export type ChatRoom = {
    id: string;
    users: ChatRoomUser[];
    messages: ChatRoomMessage[];
    lastMessage: ChatRoomMessage | null;
    writing: {[key: string]: boolean};
    messagePagination: PaginatedState;
};
