import io from "socket.io-client";
import {BACKEND_URL} from "../constants/config";
import {ChatRoom} from "../model/chat-room";
import {ResponseChatWritingDto, ResponseChatMessageDto, TokenDto, ResponseChatMessageReadDto} from "./dto";

const SOCKET_LOCATION = `${BACKEND_URL}/chat`;

const WRITING_STATE_DELAY = 1000;
const CONNECT_TIMEOUT = 6500;
const RECONNECT_DELAY = 2000;
const RECONNECT_ATTEMPTS = 3;

export type ChatSocketEventListeners = {
    onMessageReceived: (m: ResponseChatMessageDto) => void;
    onWritingStateChange: (m: ResponseChatWritingDto) => void;
    onMessageRead: (m: ResponseChatMessageReadDto) => void;
};

class ChatSocket {
    private socket: SocketIOClient.Socket | null;
    private connectCallbacks: ((connected: boolean) => void)[];
    private writingTimeout: NodeJS.Timeout | null;
    private lastSentWritingState: boolean;
    private connecting: boolean;
    private connected: boolean;

    constructor() {
        this.socket = null;
        this.connectCallbacks = [];
        this.writingTimeout = null;
        this.lastSentWritingState = false;
        this.connecting = false;
        this.connected = false;
    }

    private consumeConnectCallbacks(connectedState: boolean) {
        this.connectCallbacks.forEach((f) => f(connectedState));
        this.connectCallbacks = [];
    }

    private registerListeners(listeners: ChatSocketEventListeners) {
        if (!this.socket) return;

        this.socket.on("connect", () => {
            console.log("[ChatSocket] connected");
            this.consumeConnectCallbacks(true);
            this.connecting = false;
            this.connected = true;
        });

        this.socket.on("connect_failed", () => {
            console.log("[ChatSocket] connect_failed");
        });
        this.socket.on("connect_error", () => {
            console.log("[ChatSocket] connect_error");
        });

        this.socket.on("close", () => {
            this.connecting = false;
            this.connected = false;
            console.log("[ChatSocket] close");
        });

        this.socket.on("error", () => {
            console.log("[ChatSocket]", "Error.");
        });

        this.socket.on("exception", (e: unknown) => {
            console.log("[ChatSocket] <----", "Exception", JSON.stringify(e));
        });

        this.socket.on("disconnect", () => {
            this.connecting = false;
            this.connected = false;
            console.log("[ChatSocket] disconnected");
        });

        this.socket.on("receiveMessage", (m: ResponseChatMessageDto) => listeners.onMessageReceived(m));
        this.socket.on("readMessage", (m: ResponseChatMessageReadDto) => listeners.onMessageRead(m));
        this.socket.on("isWriting", (m: ResponseChatWritingDto) => listeners.onWritingStateChange(m));
    }

    private emit(msg: string, payload: unknown) {
        console.log(`[ChatSocket] ----> '${msg}' - payload: ${JSON.stringify(payload)}`);
        this.socket?.emit(msg, payload);
    }

    private sendWritingState(room: ChatRoom, state: boolean) {
        this.lastSentWritingState = state;
        this.emit("isWriting", {roomId: room.id, state});
    }

    private refreshWritingTimeout(room: ChatRoom) {
        if (this.writingTimeout !== null) {
            clearTimeout(this.writingTimeout);
            this.writingTimeout = null;
        }
        this.writingTimeout = setTimeout(() => {
            this.sendWritingState(room, false);
        }, WRITING_STATE_DELAY);
    }

    connect(authToken: TokenDto, listeners: ChatSocketEventListeners, callback?: (connected: boolean) => void) {
        console.log("Connecting to", SOCKET_LOCATION);

        if (callback) this.connectCallbacks.push(callback);

        // Check if we're already attempting to connect
        if (this.connecting) return;
        this.connecting = true;

        if (this.socket) this.socket.connect();
        else {
            console.log("[ChatSocket] ----> Authenticating - token =", authToken.accessToken);
            this.socket = io(SOCKET_LOCATION, {
                query: {authorization: authToken.accessToken},
                reconnectionDelay: RECONNECT_DELAY,
                reconnectionAttempts: RECONNECT_ATTEMPTS,
            });
            this.registerListeners(listeners);
        }

        setTimeout(() => {
            if (!this.connected) {
                this.connecting = false;
                this.consumeConnectCallbacks(false);
            }
        }, CONNECT_TIMEOUT);
    }

    joinRoom(room: ChatRoom) {
        this.emit("joinRoom", {roomId: room.id});
        // Inform the server that we have read the last message of the room
        if (room.lastMessage) this.readMessage(room.id, room.lastMessage._id, room.lastMessage.createdAt.toJSON());
    }

    leaveRoom(room: ChatRoom) {
        this.emit("leaveRoom", {roomId: room.id});
    }

    sendMessage(roomId: string, id: string, text: string) {
        this.emit("sendMessage", {roomId, id, text});
    }

    readMessage(roomId: string, messageId: string, createdAt: string) {
        this.emit("readMessage", {roomId, messageId, date: createdAt});
    }

    setWriting(room: ChatRoom) {
        // Refesh the timeout - in a fixed amount of time, this will tell the server we are no longer writing
        this.refreshWritingTimeout(room);

        // If we are beginning to write, inform the server now
        if (this.lastSentWritingState === false) this.sendWritingState(room, true);
    }

    disconnect() {
        if (this.socket) this.socket.disconnect();
    }
}

export default new ChatSocket();
