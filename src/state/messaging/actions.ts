import chatSocket from "../../api/chat-socket";
import {convertDtoToRoom} from "../../api/converters";
import {PaginatedRequestResponse, ResponseChatMessageDto, ResponseRoomDto} from "../../api/dto";
import {requestBackend} from "../../api/utils";
import {ROOMS_FETCH_LIMIT} from "../../constants/config";
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
    | ReceiveChatMessageAction;

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

export const connectToChat = (): AppThunk => async (dispatch, getState) => {
    const {connected, connecting} = getState().messaging.socketState;
    const authToken = getState().auth.token;

    if (!connected && !connecting) {
        if (authToken) {
            dispatch(connectToChatBegin());
            chatSocket.connect(
                authToken,
                {
                    onMessageReceived: (m) => dispatch(receiveChatMessage(m)),
                },
                () => {
                    dispatch(connectToChatSuccess());
                },
            );
        } else dispatch(connectToChatFailure());
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

    if ((activeRoom && activeRoom.id != room.id) || !connected) dispatch(joinChatRoomFailure());
    else {
        dispatch(joinChatRoomBegin(room));
        chatSocket.joinRoom(room);
        // TODO Careful if we're already in a room
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
            pending: true,
        };
        dispatch(sendChatMessageSuccess(message));
        chatSocket.sendMessage(activeRoom.id, id, text);
    } else dispatch(sendChatMessageFailure());
};

export const receiveChatMessage = (message: ResponseChatMessageDto): ReceiveChatMessageAction => ({
    type: MESSAGING_ACTION_TYPES.RECEIVE_MESSAGE,
    message,
});
