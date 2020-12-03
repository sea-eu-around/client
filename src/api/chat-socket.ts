import io from "socket.io-client";
import {BACKEND_URL} from "../constants/config";
import {ChatRoom} from "../model/chat-room";
import {ResponseChatWritingDto, ResponseChatMessageDto, TokenDto} from "./dto";

const SOCKET_LOCATION = `${BACKEND_URL}/chat`;
const WRITING_STATE_DELAY = 1000;

export type ChatSocketEventListeners = {
    onMessageReceived: (m: ResponseChatMessageDto) => void;
    onWritingStateChange: (m: ResponseChatWritingDto) => void;
};

class ChatSocket {
    private socket: SocketIOClient.Socket | null;
    private connectCallbacks: (() => void)[];
    private writingTimeout: NodeJS.Timeout | null;
    private lastSentWritingState: boolean;

    constructor() {
        this.socket = null;
        this.connectCallbacks = [];
        this.writingTimeout = null;
        this.lastSentWritingState = false;
    }

    private registerListeners(listeners: ChatSocketEventListeners) {
        if (!this.socket) return;

        this.socket.on("connect", () => {
            console.log("[ChatSocket] connected");
            this.connectCallbacks.forEach((f) => f());
            this.connectCallbacks = [];
        });

        this.socket.on("connect_error", () => {
            console.log("[ChatSocket]", "Connect error");
        });

        this.socket.on("connect_timeout", () => {
            console.log("[ChatSocket]", "Connect timeout");
        });

        this.socket.on("close", () => {
            console.log("[ChatSocket] close");
        });

        this.socket.on("connection", () => {
            console.log("[ChatSocket] connection");
        });

        this.socket.on("reconnect_attempt", () => {
            console.log("[ChatSocket] Reconnect attempt");
        });

        this.socket.on("reconnect_error", () => {
            console.log("[ChatSocket] Reconnect error");
        });

        this.socket.on("error", () => {
            console.log("[ChatSocket]", "Error.");
        });

        this.socket.on("exception", (e: unknown) => {
            console.log("[ChatSocket] <----", "Exception", JSON.stringify(e));
        });

        this.socket.on("disconnect", () => {
            console.log("[ChatSocket] disconnected");
        });

        this.socket.on("receiveMessage", (m: ResponseChatMessageDto) => listeners.onMessageReceived(m));
        this.socket.on("isWriting", (m: ResponseChatWritingDto) => listeners.onWritingStateChange(m));
    }

    connect(authToken: TokenDto, listeners: ChatSocketEventListeners, callback?: () => void) {
        console.log("Connecting to", SOCKET_LOCATION);

        if (callback) this.connectCallbacks.push(callback);
        if (this.socket) this.socket.connect();
        else {
            console.log("[ChatSocket] ----> Authenticating - token =", authToken.accessToken);
            this.socket = io(SOCKET_LOCATION, {query: {authorization: authToken.accessToken}, reconnectionDelay: 5000});
            this.registerListeners(listeners);
        }
    }

    private emit(msg: string, payload: unknown) {
        console.log(`[ChatSocket] ----> '${msg}' - payload: ${JSON.stringify(payload)}`);
        this.socket?.emit(msg, payload);
    }

    sendMessage(roomId: string, id: string, text: string) {
        this.emit("sendMessage", {roomId, id, text});
    }

    joinRoom(room: ChatRoom) {
        this.emit("joinRoom", {roomId: room.id});
    }

    leaveRoom(room: ChatRoom) {
        this.emit("leaveRoom", {roomId: room.id});
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
