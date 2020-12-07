import chatSocket from "../../api/chat-socket";
import {convertDtoToChatMessage, convertDtoToRoom} from "../../api/converters";
import {
    PaginatedRequestResponse,
    ResponseChatMessageDto,
    ResponseChatMessageReadDto,
    ResponseChatWritingDto,
    ResponseRoomDto,
    SuccessfulRequestResponse,
} from "../../api/dto";
import {requestBackend} from "../../api/utils";
import {MESSAGES_FETCH_LIMIT, ROOMS_FETCH_LIMIT} from "../../constants/config";
import {HttpStatusCode} from "../../constants/http-status";
import {ChatRoom, ChatRoomMessage} from "../../model/chat-room";
import {AppThunk} from "../types";

export enum MESSAGING_ACTION_TYPES {
    FETCH_MATCH_ROOMS_BEGIN = "MESSAGING/FETCH_MATCH_ROOMS_BEGIN",
    FETCH_MATCH_ROOMS_FAILURE = "MESSAGING/FETCH_MATCH_ROOMS_FAILURE",
    FETCH_MATCH_ROOMS_SUCCESS = "MESSAGING/FETCH_MATCH_ROOMS_SUCCESS",
    FETCH_MATCH_ROOMS_REFRESH = "MESSAGING/FETCH_MATCH_ROOMS_REFRESH",
    CONNECT_TO_CHAT_BEGIN = "MESSAGING/CONNECT_TO_CHAT_BEGIN",
    CONNECT_TO_CHAT_FAILURE = "MESSAGING/CONNECT_TO_CHAT_FAILURE",
    CONNECT_TO_CHAT_SUCCESS = "MESSAGING/CONNECT_TO_CHAT_SUCCESS",
    DISCONNECT_FROM_CHAT = "MESSAGING/DISCONNECT_FROM_CHAT",
    JOIN_CHAT_ROOM_BEGIN = "MESSAGING/JOIN_CHAT_ROOM_BEGIN",
    JOIN_CHAT_ROOM_FAILURE = "MESSAGING/JOIN_CHAT_ROOM_FAILURE",
    JOIN_CHAT_ROOM_SUCCESS = "MESSAGING/JOIN_CHAT_ROOM_SUCCESS",
    LEAVE_ROOM = "MESSAGING/LEAVE_ROOM",
    SEND_MESSAGE_FAILURE = "MESSAGING/SEND_MESSAGE_FAILURE",
    SEND_MESSAGE_SUCCESS = "MESSAGING/SEND_MESSAGE_SUCCESS",
    RECEIVE_MESSAGE = "MESSAGING/RECEIVE_MESSAGE",
    RECEIVE_WRITING_STATE = "MESSAGING/RECEIVE_WRITING_STATE",
    READ_MESSAGE = "MESSAGING/READ_MESSAGE",
    FETCH_EARLIER_MESSAGES_BEGIN = "MESSAGING/FETCH_EARLIER_MESSAGES_BEGIN",
    FETCH_EARLIER_MESSAGES_FAILURE = "MESSAGING/FETCH_EARLIER_MESSAGES_FAILURE",
    FETCH_EARLIER_MESSAGES_SUCCESS = "MESSAGING/FETCH_EARLIER_MESSAGES_SUCCESS",
}

export type FetchMatchRoomsBeginAction = {type: string};
export type FetchMatchRoomsFailureAction = {type: string};
export type FetchMatchRoomsSuccessAction = {
    type: string;
    rooms: ChatRoom[];
    canFetchMore: boolean;
};
export type FetchMatchRoomsRefreshAction = {type: string};

export type ConnectToChatBeginAction = {type: string};
export type ConnectToChatFailureAction = {type: string};
export type ConnectToChatSuccessAction = {type: string};

export type JoinChatRoomBeginAction = {type: string; room: ChatRoom};
export type JoinChatRoomFailureAction = {type: string};
export type JoinChatRoomSuccessAction = {type: string; room: ChatRoom};
export type LeaveChatRoomAction = {type: string};

export type DisconnectFromChatAction = {type: string};

export type SendMessageFailureAction = {type: string};
export type SendMessageSuccessAction = {type: string; message: ChatRoomMessage};
export type ReceiveChatMessageAction = {type: string; message: ResponseChatMessageDto};
export type ReceiveChatWritingAction = {type: string; payload: ResponseChatWritingDto};
export type ReadChatMessageAction = {type: string; payload: ResponseChatMessageReadDto};

export type FetchEarlierMessagesBeginAction = {type: string; room: ChatRoom};
export type FetchEarlierMessagesFailureAction = {type: string; room: ChatRoom};
export type FetchEarlierMessagesSuccessAction = {
    type: string;
    room: ChatRoom;
    messages: ChatRoomMessage[];
    canFetchMore: boolean;
};

export type MessagingAction =
    | FetchMatchRoomsFailureAction
    | FetchMatchRoomsSuccessAction
    | FetchMatchRoomsRefreshAction
    | ConnectToChatBeginAction
    | ConnectToChatFailureAction
    | ConnectToChatSuccessAction
    | JoinChatRoomBeginAction
    | JoinChatRoomFailureAction
    | JoinChatRoomSuccessAction
    | LeaveChatRoomAction
    | DisconnectFromChatAction
    | SendMessageFailureAction
    | SendMessageSuccessAction
    | ReceiveChatMessageAction
    | FetchEarlierMessagesBeginAction
    | FetchEarlierMessagesFailureAction
    | FetchEarlierMessagesSuccessAction;

const beginFetchMatchRooms = (): FetchMatchRoomsBeginAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_BEGIN,
});

const fetchMatchRoomsFailure = (): FetchMatchRoomsFailureAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_FAILURE,
});

const fetchMatchRoomsSuccess = (rooms: ChatRoom[], canFetchMore: boolean): FetchMatchRoomsSuccessAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_SUCCESS,
    rooms,
    canFetchMore,
});

export const fetchMatchRooms = (search?: string): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const pagination = state.messaging.matchRoomsPagination;

    if (pagination.fetching || !pagination.canFetchMore) return;

    dispatch(beginFetchMatchRooms());

    const response = await requestBackend(
        "rooms",
        "GET",
        {page: pagination.page, limit: ROOMS_FETCH_LIMIT, search},
        {},
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const rooms = (paginated.data as ResponseRoomDto[]).map(convertDtoToRoom);
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        dispatch(fetchMatchRoomsSuccess(rooms, canFetchMore));
    } else dispatch(fetchMatchRoomsFailure());
};

export const refreshMatchRooms = (): FetchMatchRoomsRefreshAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_REFRESH,
});

const connectToChatBegin = (): ConnectToChatBeginAction => ({
    type: MESSAGING_ACTION_TYPES.CONNECT_TO_CHAT_BEGIN,
});

const connectToChatFailure = (): ConnectToChatFailureAction => ({
    type: MESSAGING_ACTION_TYPES.CONNECT_TO_CHAT_FAILURE,
});

const connectToChatSuccess = (): ConnectToChatSuccessAction => ({
    type: MESSAGING_ACTION_TYPES.CONNECT_TO_CHAT_SUCCESS,
});

export const connectToChat = (callback?: (connected: boolean) => void): AppThunk => async (dispatch, getState) => {
    const {connected, connecting} = getState().messaging.socketState;
    const authToken = getState().auth.token;

    const fail = () => {
        dispatch(connectToChatFailure());
        if (callback) callback(false);
    };

    if (connected) {
        if (callback) callback(true);
    } else if (!connecting) {
        if (authToken) {
            dispatch(connectToChatBegin());
            chatSocket.connect(
                authToken,
                {
                    onMessageReceived: (m) => {
                        const {activeRoom} = getState().messaging;
                        // Tell the server we've read the message if this is the active room
                        if (activeRoom && m.roomId == activeRoom.id)
                            chatSocket.readMessage(activeRoom.id, m.id, m.updatedAt);
                        dispatch(receiveChatMessage(m));
                    },
                    onMessageRead: (p) => dispatch(readChatMessage(p)),
                    onWritingStateChange: (m) => dispatch(receiveChatWriting(m)),
                },
                (hasConnected: boolean) => {
                    if (hasConnected) {
                        dispatch(connectToChatSuccess());
                        if (callback) callback(true);
                    } else fail();
                },
            );
        } else fail();
    }
};

export const disconnectFromChat = (): DisconnectFromChatAction => {
    chatSocket.disconnect();
    return {type: MESSAGING_ACTION_TYPES.DISCONNECT_FROM_CHAT};
};

const joinChatRoomBegin = (room: ChatRoom): JoinChatRoomBeginAction => ({
    type: MESSAGING_ACTION_TYPES.JOIN_CHAT_ROOM_BEGIN,
    room,
});

const joinChatRoomFailure = (): JoinChatRoomFailureAction => ({
    type: MESSAGING_ACTION_TYPES.JOIN_CHAT_ROOM_FAILURE,
});

const joinChatRoomSuccess = (room: ChatRoom): JoinChatRoomSuccessAction => ({
    type: MESSAGING_ACTION_TYPES.JOIN_CHAT_ROOM_SUCCESS,
    room,
});

export const joinChatRoom = (room: ChatRoom): AppThunk => async (dispatch, getState) => {
    const {
        socketState: {connected},
        activeRoom,
    } = getState().messaging;

    if (activeRoom || !connected) dispatch(joinChatRoomFailure());
    else {
        dispatch(joinChatRoomBegin(room));
        chatSocket.joinRoom(room);
        dispatch(joinChatRoomSuccess(room));
    }
};

export const leaveChatRoom = (room: ChatRoom): LeaveChatRoomAction => {
    chatSocket.leaveRoom(room);
    return {type: MESSAGING_ACTION_TYPES.LEAVE_ROOM};
};

const sendChatMessageFailure = (): SendMessageFailureAction => ({
    type: MESSAGING_ACTION_TYPES.SEND_MESSAGE_FAILURE,
});

const sendChatMessageSuccess = (message: ChatRoomMessage): SendMessageSuccessAction => ({
    type: MESSAGING_ACTION_TYPES.SEND_MESSAGE_SUCCESS,
    message,
});

export const sendChatMessage = (id: string, text: string, createdAt: Date): AppThunk => async (dispatch, getState) => {
    const {
        socketState: {connected},
        activeRoom,
        localChatUser,
    } = getState().messaging;

    if (connected && activeRoom && localChatUser) {
        const message: ChatRoomMessage = {
            _id: id,
            createdAt,
            user: localChatUser,
            text,
            sent: false,
        };
        dispatch(sendChatMessageSuccess(message));
        chatSocket.sendMessage(activeRoom.id, id, text);
    } else dispatch(sendChatMessageFailure());
};

const receiveChatMessage = (message: ResponseChatMessageDto): ReceiveChatMessageAction => ({
    type: MESSAGING_ACTION_TYPES.RECEIVE_MESSAGE,
    message,
});

const receiveChatWriting = (payload: ResponseChatWritingDto): ReceiveChatWritingAction => ({
    type: MESSAGING_ACTION_TYPES.RECEIVE_WRITING_STATE,
    payload,
});

const readChatMessage = (payload: ResponseChatMessageReadDto): ReadChatMessageAction => ({
    type: MESSAGING_ACTION_TYPES.READ_MESSAGE,
    payload,
});

const beginFetchEarlierMessages = (room: ChatRoom): FetchEarlierMessagesBeginAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_EARLIER_MESSAGES_BEGIN,
    room,
});

const fetchEarlierMessagesFailure = (room: ChatRoom): FetchEarlierMessagesFailureAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_EARLIER_MESSAGES_FAILURE,
    room,
});

const fetchEarlierMessagesSuccess = (
    room: ChatRoom,
    messages: ChatRoomMessage[],
    canFetchMore: boolean,
): FetchEarlierMessagesSuccessAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_EARLIER_MESSAGES_SUCCESS,
    room,
    messages,
    canFetchMore,
});

export const fetchEarlierMessages = (room: ChatRoom): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const {
        socketState: {connected},
        localChatUser,
    } = state.messaging;
    const token = state.auth.token;
    const pagination = room.messagePagination;

    if (pagination.fetching || !pagination.canFetchMore) return;

    if (connected && localChatUser) {
        dispatch(beginFetchEarlierMessages(room));

        // Fetch messages only before the date of the earliest message we have
        const beforeDate =
            room.messages.length > 0 ? room.messages[room.messages.length - 1].createdAt.toJSON() : undefined;

        const response = await requestBackend(
            `rooms/${room.id}/messages`,
            "GET",
            {page: pagination.page, limit: MESSAGES_FETCH_LIMIT, beforeDate},
            {},
            token,
            true,
        );

        const convertDto = (dto: ResponseChatMessageDto): ChatRoomMessage | undefined => {
            const user = room.users.find((u) => u._id === dto.senderId);
            return user ? convertDtoToChatMessage(user, dto) : undefined;
        };

        if (response.status === HttpStatusCode.OK) {
            const paginated = response as PaginatedRequestResponse;
            const messages = (paginated.data as ResponseChatMessageDto[])
                .map(convertDto)
                .filter((m) => m !== undefined);
            const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
            dispatch(fetchEarlierMessagesSuccess(room, messages as ChatRoomMessage[], canFetchMore));
            return;
        }
    }

    dispatch(fetchEarlierMessagesFailure(room));
};

export const fetchMatchRoom = (roomId: string): AppThunk<Promise<ChatRoom | null>> => async (dispatch, getState) => {
    const {token} = getState().auth;

    const response = await requestBackend(`rooms/${roomId}`, "GET", {}, {}, token, true);

    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        return convertDtoToRoom(payload as ResponseRoomDto);
    } else return null;
};
