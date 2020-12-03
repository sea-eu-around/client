import {convertDtoToChatMessage} from "../../api/converters";
import {ChatRoom, ChatRoomMessage, ChatRoomUser} from "../../model/chat-room";
import {User} from "../../model/user";
import {AUTH_ACTION_TYPES, LogInSuccessAction} from "../auth/actions";
import {FetchUserSuccessAction, PROFILE_ACTION_TYPES} from "../profile/actions";
import {MessagingState, initialPaginatedState} from "../types";
import {
    FetchMatchRoomsSuccessAction,
    JoinChatRoomBeginAction,
    MessagingAction,
    MESSAGING_ACTION_TYPES,
    ReceiveChatMessageAction,
    ReceiveChatWritingAction,
    SendMessageSuccessAction,
} from "./actions";

export const initialState: MessagingState = {
    matchRooms: [],
    matchRoomsPagination: initialPaginatedState(),
    socketState: {connected: false, connecting: false},
    activeRoom: null,
    localChatUser: null,
};

function toLocalChatUser(user: User): ChatRoomUser | null {
    if (user.profile) {
        return {
            _id: user.id,
            name: `${user.profile.firstName} ${user.profile.lastName}`,
            avatar: user.profile.avatarUrl || "",
        };
    }
    return null;
}

export const messagingReducer = (state: MessagingState = initialState, action: MessagingAction): MessagingState => {
    switch (action.type) {
        case AUTH_ACTION_TYPES.LOG_IN_SUCCESS: {
            const {user} = action as LogInSuccessAction;
            return {...state, localChatUser: toLocalChatUser(user)};
        }
        case PROFILE_ACTION_TYPES.FETCH_USER_SUCCESS: {
            const {user} = action as FetchUserSuccessAction;
            return {...state, localChatUser: toLocalChatUser(user)};
        }
        case MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_BEGIN: {
            return {...state, matchRoomsPagination: {...state.matchRoomsPagination, fetching: true}};
        }
        case MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_FAILURE: {
            return {
                ...state,
                matchRoomsPagination: {...state.matchRoomsPagination, fetching: false, canFetchMore: false},
            };
        }
        case MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_SUCCESS: {
            const {rooms, canFetchMore} = <FetchMatchRoomsSuccessAction>action;
            const pagination = state.matchRoomsPagination;
            return {
                ...state,
                matchRooms: state.matchRooms.concat(rooms),
                matchRoomsPagination: {...pagination, fetching: false, page: pagination.page + 1, canFetchMore},
            };
        }
        case MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_REFRESH: {
            return {
                ...state,
                matchRooms: [],
                matchRoomsPagination: initialPaginatedState(),
            };
        }
        case MESSAGING_ACTION_TYPES.CONNECT_TO_CHAT_BEGIN: {
            return {...state, socketState: {connected: false, connecting: true}};
        }
        case MESSAGING_ACTION_TYPES.CONNECT_TO_CHAT_FAILURE: {
            return {...state, socketState: {connected: false, connecting: false}};
        }
        case MESSAGING_ACTION_TYPES.CONNECT_TO_CHAT_SUCCESS: {
            return {...state, socketState: {connected: true, connecting: false}};
        }
        case MESSAGING_ACTION_TYPES.DISCONNECT_FROM_CHAT: {
            return {...state, socketState: {connected: false, connecting: false}};
        }
        case MESSAGING_ACTION_TYPES.JOIN_CHAT_ROOM_BEGIN: {
            const {room} = action as JoinChatRoomBeginAction;
            return {...state, activeRoom: room};
        }
        case MESSAGING_ACTION_TYPES.LEAVE_ROOM: {
            return {...state, activeRoom: null};
        }
        case MESSAGING_ACTION_TYPES.SEND_MESSAGE_SUCCESS: {
            const {message} = action as SendMessageSuccessAction;
            if (state.activeRoom) {
                //return updateRoom(state, {...state.activeRoom, messages: [message].concat(state.activeRoom.messages)});
                state.activeRoom.messages.unshift(message);
                return updateRoom(state, {...state.activeRoom});
            }
            return state;
        }
        case MESSAGING_ACTION_TYPES.RECEIVE_MESSAGE: {
            const {message} = action as ReceiveChatMessageAction;

            let room = state.matchRooms.find((r: ChatRoom) => r.id === message.roomId);
            if (room) {
                room = {...room};
                // Start by checking if this is an existing message (e.g. our own message)
                const existingMessage = room.messages.find((m: ChatRoomMessage) => m._id === message.id);
                if (existingMessage) {
                    existingMessage.sent = true;
                    existingMessage.text = message.text;
                    room.lastMessage = existingMessage;
                } else {
                    const user = room.users.find((u: ChatRoomUser) => u._id == message.senderId);
                    if (user) {
                        const msg = convertDtoToChatMessage(user, message);
                        room.messages = [msg].concat(room.messages);
                        room.lastMessage = msg;
                    }
                }
                return updateRoom(state, room);
            }
            return state;
        }
        case MESSAGING_ACTION_TYPES.RECEIVE_WRITING_STATE: {
            const {payload} = action as ReceiveChatWritingAction;

            // Just ignore if this is about our own writing state
            if (state.localChatUser && state.localChatUser._id === payload.profileId) return state;

            const room = state.matchRooms.find((r: ChatRoom) => r.id === payload.roomId);
            if (room) {
                return updateRoom(state, {
                    ...room,
                    writing: {...room.writing, [payload.profileId]: payload.state},
                });
            }
            return state;
        }
        case AUTH_ACTION_TYPES.LOG_OUT: {
            // TODO disconnect from chat
            return {...state, activeRoom: null, matchRooms: [], matchRoomsPagination: initialPaginatedState()};
        }
        default:
            return state;
    }
};

function updateRoom(state: MessagingState, room: ChatRoom): MessagingState {
    const otherRooms = state.matchRooms.filter((r: ChatRoom) => r.id !== room.id);
    return {
        ...state,
        matchRooms: [room].concat(otherRooms),
        activeRoom: state.activeRoom && state.activeRoom.id == room.id ? room : state.activeRoom,
    };
}
