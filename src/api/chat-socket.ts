import {noop} from "lodash";
import io from "socket.io-client";
import {BACKEND_URL, DEBUG_MODE} from "../constants/config";
import {ChatRoom} from "../model/chat-room";
import {ResponseChatWritingDto, ResponseChatMessageDto, TokenDto, ResponseChatMessageReadDto} from "./dto";

const SOCKET_LOCATION = `${BACKEND_URL}/chat`;

const WRITING_STATE_DELAY = 1000;
const CONNECT_TIMEOUT = 2000;
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
    private lastSentWritingStateRoom: ChatRoom | null;

    private connectTimeout: NodeJS.Timeout | null;

    constructor() {
        this.socket = null;
        this.connectCallbacks = [];
        this.writingTimeout = null;
        this.lastSentWritingState = false;
        this.lastSentWritingStateRoom = null;
        this.connectTimeout = null;
    }

    private consumeConnectCallbacks(connectedState: boolean): void {
        this.connectCallbacks.forEach((f) => f(connectedState));
        this.connectCallbacks = [];
    }

    private registerListeners(listeners: ChatSocketEventListeners): void {
        if (!this.socket) return;

        this.socket.on("connect", () => {
            this.log("connected");
            if (this.connectTimeout) clearTimeout(this.connectTimeout);
            this.connectTimeout = null;
            this.consumeConnectCallbacks(true);
        });
        this.socket.on("close", () => {
            this.log("close");
            if (this.connectTimeout) clearTimeout(this.connectTimeout);
            this.connectTimeout = null;
            this.consumeConnectCallbacks(false);
        });
        this.socket.on("disconnect", () => {
            this.log("disconnected");
            if (this.connectTimeout) clearTimeout(this.connectTimeout);
            this.connectTimeout = null;
            this.consumeConnectCallbacks(false);
        });

        /*this.socket.on("connect_failed", () => this.log("connect_failed"));
        this.socket.on("connect_error", () => this.log("connect_error"));
        this.socket.on("error", () => this.log("error"));
        this.socket.on("exception", (e: unknown) => this.log("<---- Exception " + JSON.stringify(e)));*/

        this.socket.on("receiveMessage", (m: ResponseChatMessageDto) => listeners.onMessageReceived(m));
        this.socket.on("readMessage", (m: ResponseChatMessageReadDto) => listeners.onMessageRead(m));
        this.socket.on("isWriting", (m: ResponseChatWritingDto) => listeners.onWritingStateChange(m));
    }

    private log(msg: string): void {
        if (DEBUG_MODE) console.log(`[ChatSocket] ${msg}`);
    }

    private emit(msg: string, payload: unknown): void {
        this.log(`----> '${msg}' - payload: ${JSON.stringify(payload)}`);
        this.socket?.emit(msg, payload);
    }

    private sendWritingState(room: ChatRoom, state: boolean): void {
        this.lastSentWritingState = state;
        this.lastSentWritingStateRoom = room;
        this.emit("isWriting", {roomId: room.id, state});
    }

    private refreshWritingTimeout(room: ChatRoom): void {
        if (this.writingTimeout !== null) {
            clearTimeout(this.writingTimeout);
            this.writingTimeout = null;
        }
        this.writingTimeout = setTimeout(() => {
            this.sendWritingState(room, false);
        }, WRITING_STATE_DELAY);
    }

    addConnectCallback(callback: (connected: boolean) => void): void {
        this.connectCallbacks.push(callback);
    }

    connect(
        authToken: TokenDto,
        listeners: Partial<ChatSocketEventListeners> = {},
        callback?: (connected: boolean) => void,
        retry = RECONNECT_ATTEMPTS,
    ): void {
        // If we're already connected, callback and abort
        if (this.isConnected()) {
            if (callback) callback(true);
            return;
        }

        if (callback) this.addConnectCallback(callback);

        // If we're already connecting, abort (the callback we be called whenever we're connected)
        if (this.isConnecting()) return;

        this.log("Connecting to " + SOCKET_LOCATION);

        if (this.socket) {
            this.socket.connect();
            /*setTimeout(() => {
                if (this.socket) this.socket.connect();
            }, 100);*/
        } else {
            this.log("----> Authenticating - token = " + authToken.accessToken);
            this.socket = io(SOCKET_LOCATION, {
                query: {authorization: authToken.accessToken},
                //reconnectionDelay: RECONNECT_DELAY,
                //reconnectionAttempts: RECONNECT_ATTEMPTS,
                reconnection: false,
            });
            this.registerListeners({
                onMessageRead: noop,
                onMessageReceived: noop,
                onWritingStateChange: noop,
                ...listeners,
            });
        }

        if (this.connectTimeout) clearTimeout(this.connectTimeout);

        // Set a timeout to catch connection failure
        this.connectTimeout = setTimeout(() => {
            this.connectTimeout = null;
            // If we're still not connected
            if (!this.isConnected()) {
                // Try again
                if (retry > 0) this.connect(authToken, listeners, noop, retry - 1);
                // Stop trying
                else this.consumeConnectCallbacks(false);
            }
        }, CONNECT_TIMEOUT);
    }

    joinRoom(room: ChatRoom): void {
        this.emit("joinRoom", {roomId: room.id});
        // Inform the server that we have read the last message of the room
        if (room.lastMessage) this.readMessage(room.id, room.lastMessage._id, room.lastMessage.createdAt.toJSON());
    }

    leaveRoom(room: ChatRoom): void {
        this.emit("leaveRoom", {roomId: room.id});
    }

    sendMessage(roomId: string, id: string, text: string): void {
        this.emit("sendMessage", {roomId, id, text});
    }

    readMessage(roomId: string, messageId: string, createdAt: string): void {
        this.emit("readMessage", {roomId, messageId, date: createdAt});
    }

    setWriting(room: ChatRoom): void {
        // Refesh the timeout - in a fixed amount of time, this will tell the server we are no longer writing
        this.refreshWritingTimeout(room);

        // If we are beginning to write, inform the server now
        if (this.lastSentWritingState === false) this.sendWritingState(room, true);
    }

    disconnect(): void {
        // If we were connecting
        if (this.isConnecting()) {
            if (this.connectTimeout) clearTimeout(this.connectTimeout);
            this.connectTimeout = null;
            this.consumeConnectCallbacks(false);
        }
        // If the socket was connected, disconnect it
        if (this.isConnected()) {
            if (this.lastSentWritingStateRoom && this.lastSentWritingState === true)
                this.sendWritingState(this.lastSentWritingStateRoom, false);
            if (this.socket) this.socket.disconnect();
        }
    }

    isConnected(): boolean {
        return this.socket !== null && this.socket.connected;
    }

    isConnecting(): boolean {
        return this.connectTimeout !== null;
    }
}

export default new ChatSocket();
