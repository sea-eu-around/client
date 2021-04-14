import {convertDtoToChatMessage} from "../../api/converters";
import {ChatRoom, ChatRoomMessage, ChatRoomUser} from "../../model/chat-room";
import {UserProfile} from "../../model/user-profile";
import {AUTH_ACTION_TYPES, LogInSuccessAction} from "../auth/actions";
import {CreateProfileSuccessAction, FetchUserSuccessAction, PROFILE_ACTION_TYPES} from "../profile/actions";
import {MessagingState, initialPaginatedState, PaginatedFetchSuccessAction} from "../types";
import {
    FetchEarlierMessagesBeginAction,
    FetchEarlierMessagesFailureAction,
    FetchEarlierMessagesSuccessAction,
    FetchMatchRoomSuccessAction,
    FetchNewMessagesSuccessAction,
    JoinChatRoomBeginAction,
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
    activeRoomId: null,
    localChatUser: null,
    fetchingNewMessages: false,
};

function toLocalChatUser(profile: UserProfile): ChatRoomUser | null {
    return {
        _id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        avatar: profile.avatarUrl || "",
        lastMessageSeenDate: null,
        lastMessageSeenId: null,
    };
}

export const messagingReducer = (state: MessagingState = initialState, action: MessagingAction): MessagingState => {
    switch (action.type) {
        case AUTH_ACTION_TYPES.LOG_IN_SUCCESS: {
            const {user} = action as LogInSuccessAction;
            return user.profile ? {...state, localChatUser: toLocalChatUser(user.profile)} : {...state};
        }

        case PROFILE_ACTION_TYPES.FETCH_USER_SUCCESS: {
            const {user} = action as FetchUserSuccessAction;
            return user.profile ? {...state, localChatUser: toLocalChatUser(user.profile)} : {...state};
        }

        case PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS: {
            const {profile} = action as CreateProfileSuccessAction;
            return {...state, localChatUser: toLocalChatUser(profile)};
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
            const {items, canFetchMore} = action as PaginatedFetchSuccessAction<ChatRoom>;
            const pagination = state.matchRoomsPagination;
            const matchRooms = {...state.matchRooms};
            // Add entries in the rooms dictionary
            items.forEach((r: ChatRoom) => {
                if (matchRooms[r.id]) {
                    // matchRooms[r.id] = {...matchRooms[r.id], lastMessage: r.lastMessage, users: r.users};
                    matchRooms[r.id] = {...matchRooms[r.id], lastMessage: r.lastMessage};
                } else {
                    matchRooms[r.id] = r;
                }
            });
            const ids = items.map((r: ChatRoom) => r.id);

            return {
                ...state,
                matchRooms,
                matchRoomsOrdered: pagination.page === 1 ? ids : state.matchRoomsOrdered.concat(ids),
                matchRoomsPagination: {...pagination, fetching: false, page: pagination.page + 1, canFetchMore},
            };
        }
        case MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOMS_REFRESH: {
            return {
                ...state,
                // Reset the pagination
                matchRoomsPagination: initialPaginatedState(),
            };
        }

        case MESSAGING_ACTION_TYPES.FETCH_MATCH_ROOM_SUCCESS: {
            const {room} = action as FetchMatchRoomSuccessAction;

            return {
                ...state,
                matchRooms: {
                    ...state.matchRooms,
                    [room.id]: state.matchRooms[room.id]
                        ? {...state.matchRooms[room.id], lastMessage: room.lastMessage}
                        : room,
                },
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
            return {...state, socketState: {connected: false, connecting: false}, activeRoomId: null};
        }

        case MESSAGING_ACTION_TYPES.JOIN_CHAT_ROOM_BEGIN: {
            const {room} = action as JoinChatRoomBeginAction;
            return {...state, activeRoomId: room.id};
        }
        case MESSAGING_ACTION_TYPES.JOIN_CHAT_ROOM_FAILURE:
        case MESSAGING_ACTION_TYPES.LEAVE_ROOM: {
            return {...state, activeRoomId: null};
        }

        case MESSAGING_ACTION_TYPES.SEND_MESSAGE_SUCCESS: {
            const {message} = action as SendMessageSuccessAction;
            if (state.activeRoomId) {
                const room = state.matchRooms[state.activeRoomId];
                return updateRoom(state, true, {
                    ...room,
                    messages: [message].concat(room.messages),
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
            const {room, items, canFetchMore} = action as FetchEarlierMessagesSuccessAction;
            const pagination = room.messagePagination;
            return updateRoom(state, false, {
                ...room,
                messages: room.messages.concat(items),
                messagePagination: {...pagination, fetching: false, page: pagination.page + 1, canFetchMore},
            });
        }

        case MESSAGING_ACTION_TYPES.FETCH_NEW_MESSAGES_BEGIN: {
            return {
                ...state,
                fetchingNewMessages: true,
            };
        }
        case MESSAGING_ACTION_TYPES.FETCH_NEW_MESSAGES_FAILURE: {
            return {
                ...state,
                fetchingNewMessages: false,
            };
        }
        case MESSAGING_ACTION_TYPES.FETCH_NEW_MESSAGES_SUCCESS: {
            const {room, items} = action as FetchNewMessagesSuccessAction;
            const filteredMessages = items.filter((ma) => !room.messages.some((mb) => mb._id === ma._id));
            const users = room.users.concat(); // copy

            // Update the last message seen for the user who sent it
            if (filteredMessages.length > 0) {
                const lastMessage = filteredMessages[0];
                const i = users.findIndex((u) => u._id === lastMessage.user._id);
                users[i] = {
                    ...users[i],
                    lastMessageSeenId: lastMessage._id,
                    lastMessageSeenDate: lastMessage.createdAt,
                };
            }

            return updateRoom({...state, fetchingNewMessages: false}, false, {
                ...room,
                messages: filteredMessages.concat(room.messages),
                users,
                ...(filteredMessages.length > 0 ? {lastMessage: filteredMessages[0]} : {}),
            });
        }

        case AUTH_ACTION_TYPES.LOG_OUT: {
            return {
                ...state,
                activeRoomId: null,
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
    if (setAsFirst) {
        const otherRooms = state.matchRoomsOrdered.filter((id: string) => id !== room.id);
        return {
            ...state,
            matchRooms: {...state.matchRooms, [room.id]: room},
            matchRoomsOrdered: [room.id].concat(otherRooms),
        };
    } else {
        return {
            ...state,
            matchRooms: {...state.matchRooms, [room.id]: room},
        };
    }
}
