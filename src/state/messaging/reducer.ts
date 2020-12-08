import {convertDtoToChatMessage} from "../../api/converters";
import {ChatRoom, ChatRoomMessage, ChatRoomUser} from "../../model/chat-room";
import {User} from "../../model/user";
import {AUTH_ACTION_TYPES, LogInSuccessAction} from "../auth/actions";
import {FetchUserSuccessAction, PROFILE_ACTION_TYPES} from "../profile/actions";
import {MessagingState, initialPaginatedState} from "../types";
import {
    FetchEarlierMessagesBeginAction,
    FetchEarlierMessagesFailureAction,
    FetchEarlierMessagesSuccessAction,
    FetchMatchRoomsSuccessAction,
    JoinChatRoomSuccessAction,
    MessagingAction,
    MESSAGING_ACTION_TYPES,
    ReadChatMessageAction,
    ReceiveChatMessageAction,
    ReceiveChatWritingAction,
    SendMessageSuccessAction,
} from "./actions";

export const initialState: MessagingState = {
    matchRooms: {},
    matchRoomsOrdered: [],
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
            lastMessageSeenDate: null,
            lastMessageSeenId: null,
        };
    }
    return null;
}

// TODO reset rooms when disconnecting from chat?

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
            const matchRooms = {...state.matchRooms};
            // Add entries in the rooms dictionary
            rooms.forEach((r: ChatRoom) => (matchRooms[r.id] = r));

            return {
                ...state,
                matchRooms,
                matchRoomsOrdered: state.matchRoomsOrdered.concat(rooms.map((r: ChatRoom) => r.id)),
                matchRoomsPagination: {...pagination, fetching: false, page: pagination.page + 1, canFetchMore},
            };
        }
        case MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_REFRESH: {
            return {
                ...state,
                matchRooms: {},
                matchRoomsOrdered: [],
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
        case MESSAGING_ACTION_TYPES.JOIN_CHAT_ROOM_SUCCESS: {
            const {room} = action as JoinChatRoomSuccessAction;
            return {...state, activeRoom: room};
        }
        case MESSAGING_ACTION_TYPES.LEAVE_ROOM: {
            return {...state, activeRoom: null};
        }
        case MESSAGING_ACTION_TYPES.SEND_MESSAGE_SUCCESS: {
            const {message} = action as SendMessageSuccessAction;
            if (state.activeRoom) {
                return updateRoom(state, true, {
                    ...state.activeRoom,
                    messages: [message].concat(state.activeRoom.messages),
                    lastMessage: message,
                });
            }
            return state;
        }
        case MESSAGING_ACTION_TYPES.RECEIVE_MESSAGE: {
            const {message} = action as ReceiveChatMessageAction;

            let room = state.matchRooms[message.roomId];
            if (room) {
                room = {...room};
                // Start by checking if this is an existing message (e.g. our own message)
                const existingMessage = room.messages.find((m: ChatRoomMessage) => m._id === message.id);
                if (existingMessage) {
                    const msg = {...existingMessage, sent: true, text: message.text};

                    // Update the message in the list
                    room.messages = room.messages.map((m: ChatRoomMessage) => (m._id === message.id ? msg : m));

                    // Also update the last message
                    if (!room.lastMessage || msg.createdAt >= room.lastMessage.createdAt) room.lastMessage = msg;
                } else {
                    const user = room.users.find((u: ChatRoomUser) => u._id == message.senderId);
                    if (user) {
                        const msg = convertDtoToChatMessage(user, message);
                        room.messages = [msg].concat(room.messages);
                        room.lastMessage = msg;
                        room.writing[message.senderId] = false;
                    }
                }
                return updateRoom(state, true, room);
            }
            return state;
        }
        case MESSAGING_ACTION_TYPES.RECEIVE_WRITING_STATE: {
            const payload = (action as ReceiveChatWritingAction).payload;
            const {profileId, roomId} = payload;

            // Just ignore if this is about our own writing state
            if (state.localChatUser && state.localChatUser._id === profileId) return state;

            const room = state.matchRooms[roomId];
            if (room) {
                return updateRoom(state, false, {
                    ...room,
                    writing: {...room.writing, [profileId]: payload.state},
                });
            }
            return state;
        }
        case MESSAGING_ACTION_TYPES.READ_MESSAGE: {
            const {roomId, date, messageId, profileId} = (action as ReadChatMessageAction).payload;

            const room = state.matchRooms[roomId];
            if (room) {
                return updateRoom(state, false, {
                    ...room,
                    users: room.users.map((u: ChatRoomUser) =>
                        u._id == profileId
                            ? {...u, lastMessageSeenDate: new Date(date), lastMessageSeenId: messageId}
                            : u,
                    ),
                });
            }
            return state;
        }
        case MESSAGING_ACTION_TYPES.FETCH_EARLIER_MESSAGES_BEGIN: {
            const {room} = action as FetchEarlierMessagesBeginAction;
            return updateRoom(state, false, {
                ...room,
                messagePagination: {...room.messagePagination, fetching: true},
            });
        }
        case MESSAGING_ACTION_TYPES.FETCH_EARLIER_MESSAGES_FAILURE: {
            const {room} = action as FetchEarlierMessagesFailureAction;
            return updateRoom(state, false, {
                ...room,
                messagePagination: {...room.messagePagination, fetching: false, canFetchMore: false},
            });
        }
        case MESSAGING_ACTION_TYPES.FETCH_EARLIER_MESSAGES_SUCCESS: {
            const {room, messages, canFetchMore} = action as FetchEarlierMessagesSuccessAction;
            const pagination = room.messagePagination;
            return updateRoom(state, false, {
                ...room,
                messages: room.messages.concat(messages),
                messagePagination: {...pagination, fetching: false, page: pagination.page + 1, canFetchMore},
            });
        }
        case AUTH_ACTION_TYPES.LOG_OUT: {
            return {
                ...state,
                activeRoom: null,
                matchRooms: {},
                matchRoomsOrdered: [],
                matchRoomsPagination: initialPaginatedState(),
                localChatUser: null,
            };
        }
        default:
            return state;
    }
};

function updateRoom(state: MessagingState, setAsFirst: boolean, room: ChatRoom): MessagingState {
    const activeRoom = state.activeRoom && state.activeRoom.id == room.id ? room : state.activeRoom;

    if (setAsFirst) {
        const otherRooms = state.matchRoomsOrdered.filter((id: string) => id !== room.id);
        return {
            ...state,
            matchRooms: {...state.matchRooms, [room.id]: room},
            matchRoomsOrdered: [room.id].concat(otherRooms),
            activeRoom,
        };
    } else {
        return {
            ...state,
            matchRooms: {...state.matchRooms, [room.id]: room},
            activeRoom,
        };
    }
}
