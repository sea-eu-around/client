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
import {
    AppThunk,
    PaginatedFetchBeginAction,
    PaginatedFetchFailureAction,
    PaginatedFetchSuccessAction,
    PaginatedFetchSuccessActionRefreshable,
} from "../types";

export enum MESSAGING_ACTION_TYPES {
    FETCH_MATCH_ROOMS_BEGIN = "MESSAGING/FETCH_MATCH_ROOMS_BEGIN",
    FETCH_MATCH_ROOMS_FAILURE = "MESSAGING/FETCH_MATCH_ROOMS_FAILURE",
    FETCH_MATCH_ROOMS_SUCCESS = "MESSAGING/FETCH_MATCH_ROOMS_SUCCESS",
    FETCH_MATCH_ROOM_SUCCESS = "MESSAGING/FETCH_MATCH_ROOM_SUCCESS",
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
    FETCH_NEW_MESSAGES_BEGIN = "MESSAGING/FETCH_NEW_MESSAGES_BEGIN",
    FETCH_NEW_MESSAGES_FAILURE = "MESSAGING/FETCH_NEW_MESSAGES_FAILURE",
    FETCH_NEW_MESSAGES_SUCCESS = "MESSAGING/FETCH_NEW_MESSAGES_SUCCESS",
}

export type FetchMatchRoomSuccessAction = {type: string; room: ChatRoom};

export type ConnectToChatBeginAction = {type: string};
export type ConnectToChatFailureAction = {type: string};
export type ConnectToChatSuccessAction = {type: string};

export type JoinChatRoomBeginAction = {type: string; room: ChatRoom};
export type JoinChatRoomFailureAction = {type: string; room: ChatRoom};
export type JoinChatRoomSuccessAction = {type: string; room: ChatRoom};
export type LeaveChatRoomAction = {type: string};

export type DisconnectFromChatAction = {type: string};

export type SendMessageFailureAction = {type: string};
export type SendMessageSuccessAction = {type: string; message: ChatRoomMessage};
export type ReceiveChatMessageAction = {type: string; message: ResponseChatMessageDto};
export type ReceiveChatWritingAction = {type: string; payload: ResponseChatWritingDto};
export type ReadChatMessageAction = {type: string; payload: ResponseChatMessageReadDto};

export type FetchEarlierMessagesBeginAction = {room: ChatRoom} & PaginatedFetchBeginAction;
export type FetchEarlierMessagesFailureAction = {room: ChatRoom} & PaginatedFetchFailureAction;
export type FetchEarlierMessagesSuccessAction = {room: ChatRoom} & PaginatedFetchSuccessAction<ChatRoomMessage>;

export type FetchNewMessagesBeginAction = {room: ChatRoom} & PaginatedFetchBeginAction;
export type FetchNewMessagesFailureAction = {room: ChatRoom} & PaginatedFetchFailureAction;
export type FetchNewMessagesSuccessAction = {room: ChatRoom} & PaginatedFetchSuccessAction<ChatRoomMessage>;

export type MessagingAction =
    | FetchMatchRoomSuccessAction
    | PaginatedFetchBeginAction
    | PaginatedFetchSuccessActionRefreshable<ChatRoom>
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
    | FetchEarlierMessagesSuccessAction
    | FetchNewMessagesBeginAction
    | FetchNewMessagesFailureAction
    | FetchNewMessagesSuccessAction;

const beginFetchMatchRooms = (): PaginatedFetchBeginAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_BEGIN,
});

const fetchMatchRoomsFailure = (): PaginatedFetchFailureAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_FAILURE,
});

const fetchMatchRoomsSuccess = (
    items: ChatRoom[],
    canFetchMore: boolean,
    refresh: boolean,
): PaginatedFetchSuccessActionRefreshable<ChatRoom> => ({
    type: MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_SUCCESS,
    items,
    canFetchMore,
    refresh,
});

export const fetchMatchRooms = (search?: string, refresh = false): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const pagination = state.messaging.matchRoomsPagination;

    if (!refresh && (pagination.fetching || !pagination.canFetchMore)) return;

    dispatch(beginFetchMatchRooms());

    const response = await requestBackend(
        "rooms",
        "GET",
        {page: refresh ? 1 : pagination.page, limit: ROOMS_FETCH_LIMIT, search},
        {},
        token,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const rooms = (paginated.data as ResponseRoomDto[]).map(convertDtoToRoom);
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        dispatch(fetchMatchRoomsSuccess(rooms, canFetchMore, refresh));
    } else dispatch(fetchMatchRoomsFailure());
};

export const refreshMatchRooms = (search?: string): AppThunk => async (dispatch) => {
    dispatch(fetchMatchRooms(search, true));
};

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
    const authToken = getState().auth.token;

    const fail = () => {
        dispatch(connectToChatFailure());
        if (callback) callback(false);
    };

    if (chatSocket.isConnected()) {
        if (callback) callback(true);
    } else if (authToken) {
        if (chatSocket.isConnecting()) {
            if (callback) chatSocket.addConnectCallback(callback);
        } else {
            dispatch(connectToChatBegin());
            chatSocket.connect(
                authToken,
                {
                    onMessageReceived: (m) => {
                        const {activeRoomId} = getState().messaging;
                        // Tell the server we've read the message if this is the active room
                        if (m.roomId == activeRoomId) chatSocket.readMessage(activeRoomId, m.id, m.updatedAt);
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
        }
    } else fail();
};

export const disconnectFromChat = (): DisconnectFromChatAction => {
    chatSocket.disconnect();
    return {type: MESSAGING_ACTION_TYPES.DISCONNECT_FROM_CHAT};
};

const joinChatRoomBegin = (room: ChatRoom): JoinChatRoomBeginAction => ({
    type: MESSAGING_ACTION_TYPES.JOIN_CHAT_ROOM_BEGIN,
    room,
});

const joinChatRoomFailure = (room: ChatRoom): JoinChatRoomFailureAction => ({
    type: MESSAGING_ACTION_TYPES.JOIN_CHAT_ROOM_FAILURE,
    room,
});

const joinChatRoomSuccess = (room: ChatRoom): JoinChatRoomSuccessAction => ({
    type: MESSAGING_ACTION_TYPES.JOIN_CHAT_ROOM_SUCCESS,
    room,
});

export const joinChatRoom = (room: ChatRoom): AppThunk => async (dispatch) => {
    if (chatSocket.isConnected()) {
        dispatch(joinChatRoomBegin(room));
        chatSocket.joinRoom(room);
        dispatch(joinChatRoomSuccess(room));
    } else dispatch(joinChatRoomFailure(room));
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
    const {activeRoomId, localChatUser} = getState().messaging;

    if (chatSocket.isConnected() && activeRoomId && localChatUser) {
        const message: ChatRoomMessage = {
            _id: id,
            createdAt,
            user: localChatUser,
            text,
            sent: false,
        };
        dispatch(sendChatMessageSuccess(message));
        chatSocket.sendMessage(activeRoomId, id, text);
    } else dispatch(sendChatMessageFailure());
};

export const receiveChatMessage = (message: ResponseChatMessageDto): ReceiveChatMessageAction => ({
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

const fetchEarlierMessagesBegin = (room: ChatRoom): FetchEarlierMessagesBeginAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_EARLIER_MESSAGES_BEGIN,
    room,
});

const fetchEarlierMessagesFailure = (room: ChatRoom): FetchEarlierMessagesFailureAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_EARLIER_MESSAGES_FAILURE,
    room,
});

const fetchEarlierMessagesSuccess = (
    room: ChatRoom,
    items: ChatRoomMessage[],
    canFetchMore: boolean,
): FetchEarlierMessagesSuccessAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_EARLIER_MESSAGES_SUCCESS,
    room,
    items,
    canFetchMore,
});

const fetchNewMessagesBegin = (room: ChatRoom): FetchNewMessagesBeginAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_NEW_MESSAGES_BEGIN,
    room,
});

const fetchNewMessagesFailure = (room: ChatRoom): FetchNewMessagesFailureAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_NEW_MESSAGES_FAILURE,
    room,
});

const fetchNewMessagesSuccess = (
    room: ChatRoom,
    items: ChatRoomMessage[],
    canFetchMore: boolean,
): FetchNewMessagesSuccessAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_NEW_MESSAGES_SUCCESS,
    room,
    items,
    canFetchMore,
});

/**
 * Fetch all messages that are more recent than the last one we have for a given room.
 * @param room a ChatRoom
 */
export const fetchNewMessages = (room: ChatRoom): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const {fetchingNewMessages} = state.messaging;
    const token = state.auth.token;

    if (fetchingNewMessages) return;
    const lastMessage = room.lastMessage;

    if (chatSocket.isConnected() && lastMessage) {
        dispatch(fetchNewMessagesBegin(room));

        // Fetch messages only after the date of the latest message we have
        const afterDate = lastMessage.createdAt.toJSON();

        const fetchPage = async (page: number) => {
            const response = await requestBackend(
                `rooms/${room.id}/messages`,
                "GET",
                {page, limit: MESSAGES_FETCH_LIMIT, afterDate},
                {},
                token,
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

                // Keep fetching if there are more messages to fetch
                if (page < paginated.meta.totalPages) fetchPage(page + 1);
                else if (messages.length > 0 && messages[0]) {
                    // Inform the server that we've read the last message
                    chatSocket.readMessage(room.id, messages[0]._id, messages[0].createdAt.toJSON());
                }
                dispatch(
                    fetchNewMessagesSuccess(room, messages as ChatRoomMessage[], page < paginated.meta.totalPages),
                );
            } else dispatch(fetchNewMessagesFailure(room));
        };

        fetchPage(1);
    } else {
        dispatch(fetchNewMessagesFailure(room));
    }
};

export const fetchEarlierMessages = (room: ChatRoom): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const {
        socketState: {connected},
    } = state.messaging;
    const token = state.auth.token;
    const pagination = room.messagePagination;

    if (pagination.fetching || !pagination.canFetchMore) return;

    if (connected) {
        dispatch(fetchEarlierMessagesBegin(room));

        // Fetch messages only before the date of the earliest message we have
        const beforeDate =
            room.messages.length > 0 ? room.messages[room.messages.length - 1].createdAt.toJSON() : undefined;

        const response = await requestBackend(
            `rooms/${room.id}/messages`,
            "GET",
            {page: 1, limit: MESSAGES_FETCH_LIMIT, beforeDate},
            {},
            token,
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
        } else dispatch(fetchEarlierMessagesFailure(room));
    } else {
        dispatch(fetchEarlierMessagesFailure(room));
    }
};

const fetchMatchRoomSuccess = (room: ChatRoom): FetchMatchRoomSuccessAction => ({
    type: MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOM_SUCCESS,
    room,
});

export const fetchMatchRoom = (roomId: string): AppThunk<Promise<ChatRoom | null>> => async (dispatch, getState) => {
    const {token} = getState().auth;

    const response = await requestBackend(`rooms/${roomId}`, "GET", {}, {}, token);

    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        const room = convertDtoToRoom(payload as ResponseRoomDto);
        dispatch(fetchMatchRoomSuccess(room));
        return room;
    } else return null;
};
