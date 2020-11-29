export enum MESSAGING_ACTION_TYPES {
    // FETCH_ROOMS = "MESSAGING/FETCH_ROOMS",
    FETCH_ROOMS_FAILURE = "MESSAGING/FETCH_ROOMS_FAILURE",
    FETCH_ROOMS_SUCCESS = "MESSAGING/FETCH_ROOMS_SUCCESS",
    FETCH_ROOMS_REFRESH = "MESSAGING/FETCH_ROOMS_REFRESH",
    JOIN_ROOM = "MESSAGING/JOIN_ROOM",
    JOIN_ROOM_FAILURE = "MESSAGING/JOIN_ROOM_FAILURE",
    JOIN_ROOM_SUCCESS = "MESSAGING/JOIN_ROOM_SUCCESS",
    LEAVE_ROOM = "MESSAGING/LEAVE_ROOM",
}

export type FetchRoomsFailureAction = {
    type: MESSAGING_ACTION_TYPES.FETCH_ROOMS_FAILURE;
};

export type MessagingAction = FetchRoomsFailureAction;
