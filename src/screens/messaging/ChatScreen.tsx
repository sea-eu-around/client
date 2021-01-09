import {MaterialIcons} from "@expo/vector-icons";
import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {AppState as RNAppState, AppStateStatus, ScrollView, ScrollViewProps, StyleSheet, View} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {withTheme} from "react-native-elements";
import {
    Actions,
    ActionsProps,
    Bubble,
    BubbleProps,
    GiftedAvatar,
    GiftedAvatarProps,
    GiftedChat,
    IMessage,
    InputToolbar,
    InputToolbarProps,
    Message,
    MessageProps,
    Send,
    SendProps,
} from "react-native-gifted-chat";
import {connect, ConnectedProps} from "react-redux";
import chatSocket from "../../api/chat-socket";
import {RootNavigatorScreens} from "../../navigation/types";
import {
    connectToChat,
    disconnectFromChat,
    fetchEarlierMessages,
    fetchMatchRoom,
    fetchNewMessages,
    joinChatRoom,
    leaveChatRoom,
    sendChatMessage,
} from "../../state/messaging/actions";
import {AppState, MyThunkDispatch} from "../../state/types";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import {TypingAnimation} from "react-native-typing-animation";
import {ChatRoom, ChatRoomUser} from "../../model/chat-room";
import store from "../../state/store";
import {CHAT_CONNECTED_ROUTES, DEBUG_MODE, MESSAGES_FETCH_LIMIT} from "../../constants/config";
import ScreenWrapper from "../ScreenWrapper";
import {rootNavigationRef} from "../../navigation/utils";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    rooms: state.messaging.matchRooms,
    activeRoom: state.messaging.activeRoom,
    localChatUser: state.messaging.localChatUser,
    connected: state.messaging.socketState.connected,
    connecting: state.messaging.socketState.connecting,
    fetchingNewMessages: state.messaging.fetchingNewMessages,
}));

// Component props
export type ChatScreenProps = ThemeProps &
    ConnectedProps<typeof reduxConnector> &
    StackScreenProps<RootNavigatorScreens>;

const MIN_INPUT_HEIGHT = 45;
const INPUT_VERTICAL_MARGIN = 10;

class ChatScreen extends React.Component<ChatScreenProps> {
    ref = React.createRef<GiftedChat>();

    private getRoomId(): string | null {
        const {route} = this.props;
        // Get the room ID from the route parameters
        if (route.params) {
            const params = route.params as {[key: string]: string};
            const {roomId} = params;
            return roomId;
        }
        return null;
    }

    private getRoom(): ChatRoom | null {
        const {rooms, activeRoom} = this.props;
        const roomId = this.getRoomId();
        return activeRoom || (roomId ? rooms[roomId] : null);
    }

    private connectToRoom(): void {
        const dispatch = this.props.dispatch as MyThunkDispatch;

        const joinRoom = async (room: ChatRoom) => {
            dispatch(joinChatRoom(room));
            this.ensureLatestMessages();
        };

        const roomId = this.getRoomId();
        // If a roomId parameter was given, we first ensure we have that room (in storage or we fetch it) before joining it.
        if (roomId) {
            const room = store.getState().messaging.matchRooms[roomId];
            if (room) joinRoom(room);
            else dispatch(fetchMatchRoom(roomId)).then((r) => r && joinRoom(r));
        }
    }

    componentDidMount(): void {
        const {navigation} = this.props;
        navigation.addListener("blur", () => this.onBlur());
        navigation.addListener("focus", () => this.onFocus());
        this.onFocus();

        // Handle app state changes (active / inactive)
        let previousAppStatus: AppStateStatus;
        RNAppState.addEventListener("change", (status: AppStateStatus) => {
            // If the app is now active
            if (previousAppStatus !== "active" && status === "active") this.onAppActive();
            // If the app is no longer active
            if (previousAppStatus === "active" && status !== "active") this.onAppInactive();
            previousAppStatus = status;
        });
    }

    componentDidUpdate(oldProps: ChatScreenProps): void {
        const {activeRoom, connected} = this.props;
        // If we've just connected to the chat, connect to the room
        if (!oldProps.connected && connected) this.connectToRoom();
        // If we're at the beginning of the messages pagination
        if (!oldProps.activeRoom && activeRoom && activeRoom.messagePagination.page == 1) this.ensureLatestMessages();
    }

    private onAppActive(): void {
        const {connected, dispatch} = this.props;
        // Reconnect to chat if needed
        if (!connected) {
            const route = rootNavigationRef.current?.getCurrentRoute()?.name;
            const isChat = CHAT_CONNECTED_ROUTES.find((r) => r === route);
            if (isChat) (dispatch as MyThunkDispatch)(connectToChat());
        }
    }

    private onAppInactive(): void {
        const {connected, dispatch} = this.props;
        // Disconnect from the chat if connected
        if (connected) dispatch(disconnectFromChat());
    }

    private onBlur(): void {
        // Leave the room when navigating to another screen
        const {dispatch, activeRoom} = this.props;
        if (activeRoom) (dispatch as MyThunkDispatch)(leaveChatRoom(activeRoom));
    }

    private onFocus(): void {
        const {connected, connecting, dispatch} = this.props;

        // If are already connected to the chat, connect to the room
        if (connected) this.connectToRoom();
        // If we are not connected nor connecting to the chat, connect to the chat first
        else if (!connecting) (dispatch as MyThunkDispatch)(connectToChat());
    }

    /**
     * Ensures that the latest n messages are loaded
     */
    private ensureLatestMessages(): void {
        const {dispatch, fetchingNewMessages} = this.props;
        const room = this.getRoom();

        // Fetch all messages that are more recent than the last one we have
        if (room && !fetchingNewMessages) (dispatch as MyThunkDispatch)(fetchNewMessages(room));

        // Fetch earlier messages if we need to
        if (room && room.messages.length < MESSAGES_FETCH_LIMIT) this.fetchEarlier();
    }

    private fetchEarlier(): void {
        const {dispatch} = this.props;
        const room = this.getRoom();
        if (room && !room.messagePagination.fetching) (dispatch as MyThunkDispatch)(fetchEarlierMessages(room));
    }

    render(): JSX.Element {
        const {theme, localChatUser, dispatch} = this.props;
        const styles = themedStyles(theme);

        const room = this.getRoom();

        let chatComponent = <></>;
        if (room && localChatUser) {
            const isWritingId = Object.keys(room.writing).find((id: string) => room.writing[id] === true);
            const userWriting = isWritingId ? room.users.find((u) => u._id == isWritingId) : undefined;

            // Store in a messageId -> user map whether each message is the last seen message of a user
            const lastMessageDict: {[key: string]: ChatRoomUser[]} = {};
            if (room.messages.length > 0) {
                room.users.forEach((u: ChatRoomUser) => {
                    if (u._id != localChatUser._id && u.lastMessageSeenId) {
                        if (lastMessageDict[u.lastMessageSeenId]) lastMessageDict[u.lastMessageSeenId].push(u);
                        else lastMessageDict[u.lastMessageSeenId] = [u];
                    }
                });
            }

            chatComponent = (
                <GiftedChat
                    ref={this.ref}
                    messages={room.messages}
                    user={localChatUser}
                    renderSend={(props: SendProps<IMessage>) => (
                        <Send {...props} containerStyle={styles.sendContainer}>
                            <MaterialIcons name="send" style={styles.send} />
                        </Send>
                    )}
                    renderBubble={(props: BubbleProps<IMessage>) => (
                        <Bubble
                            {...props}
                            renderTicks={(currentMessage: IMessage) => (
                                <View style={styles.messageTicksContainer}>
                                    {currentMessage.received && (
                                        <MaterialIcons name="check" style={styles.messageTick} />
                                    )}
                                    {currentMessage.sent && <MaterialIcons name="check" style={styles.messageTick} />}
                                </View>
                            )}
                            textStyle={{left: styles.bubbleTextLeft, right: styles.bubbleTextRight}}
                            wrapperStyle={{left: styles.bubbleWrapperLeft, right: styles.bubbleWrapperRight}}
                        />
                    )}
                    renderMessage={(props: MessageProps<IMessage>) => {
                        const seenBy = props.currentMessage ? lastMessageDict[props.currentMessage._id] : [];
                        return <ChatMessage theme={theme} seenBy={seenBy || []} messageProps={props} />;
                    }}
                    renderInputToolbar={(props: InputToolbarProps) => (
                        <InputToolbar
                            {...props}
                            containerStyle={styles.inputToolbarContainer}
                            primaryStyle={styles.inputToolbarPrimary}
                        />
                    )}
                    renderFooter={() => <ChatFooter userWriting={userWriting} theme={theme} />}
                    renderActions={(props: ActionsProps) => <ChatActions actionsProps={props} theme={theme} />}
                    //renderLoadEarlier={() => <></>}
                    onInputTextChanged={(t) => {
                        if (t.length > 0) chatSocket.setWriting(room);
                    }}
                    onSend={(messages) => {
                        messages.forEach((m) =>
                            (dispatch as MyThunkDispatch)(sendChatMessage(m._id + "", m.text, m.createdAt as Date)),
                        );
                    }}
                    loadEarlier={room.messagePagination.canFetchMore && room.messagePagination.fetching}
                    isLoadingEarlier={room.messagePagination.fetching}
                    onLoadEarlier={() => {
                        this.fetchEarlier();
                    }}
                    timeFormat={"HH:mm"}
                    listViewProps={{
                        onEndReached: () => this.fetchEarlier(),
                        renderScrollComponent: (props: ScrollViewProps) => (
                            <ScrollView
                                {...props}
                                contentContainerStyle={[
                                    props.contentContainerStyle,
                                    // This is actually a paddingTop but gifted-chat flips the rendering.
                                    // Compensates for the height of the transparent header.
                                    {paddingBottom: 100},
                                ]}
                            />
                        ),
                    }}
                    textInputProps={{autoFocus: false, style: styles.textInput, multiline: true}}
                    minInputToolbarHeight={MIN_INPUT_HEIGHT + INPUT_VERTICAL_MARGIN * 2}
                />
            );
        }

        return (
            <ScreenWrapper>
                <View style={styles.container}>{chatComponent}</View>
            </ScreenWrapper>
        );
    }
}

function ChatFooter({userWriting, theme}: {userWriting?: ChatRoomUser; theme: Theme}): JSX.Element {
    if (userWriting) {
        return (
            <View style={{height: 50, paddingTop: 10, marginBottom: 5}}>
                <Message
                    key="isWriting"
                    user={userWriting}
                    showUserAvatar={true}
                    position="left"
                    renderAvatar={(props: GiftedAvatarProps) => <GiftedAvatar {...props} user={userWriting} />}
                    renderBubble={(props: BubbleProps<IMessage>) => (
                        <Bubble
                            {...props}
                            wrapperStyle={{
                                left: {backgroundColor: "transparent"},
                                right: {},
                            }}
                            renderCustomView={() => (
                                <TypingAnimation
                                    dotColor={theme.textLight}
                                    dotAmplitude={3}
                                    dotSpeed={0.16}
                                    dotMargin={8}
                                    dotRadius={4}
                                    dotX={20}
                                    dotY={-25}
                                />
                            )}
                        />
                    )}
                ></Message>
            </View>
        );
    } else return <></>;
}

function ChatMessage({
    theme,
    seenBy,
    messageProps,
}: {
    theme: Theme;
    seenBy: ChatRoomUser[];
    messageProps: MessageProps<IMessage>;
}): JSX.Element {
    const styles = themedStyles(theme);
    return (
        <View style={messageProps.position === "left" ? styles.messageContainerLeft : styles.messageContainerRight}>
            <Message
                {...messageProps}
                containerStyle={{
                    left: [messageProps.containerStyle?.left],
                    right: [messageProps.containerStyle?.right, {marginBottom: 2}],
                }}
            />
            {seenBy.length > 0 && (
                <View
                    style={[
                        messageProps.position === "left"
                            ? styles.messageReadContainerLeft
                            : styles.messageReadContainerRight,
                    ]}
                >
                    {seenBy.map((u: ChatRoomUser) => (
                        <GiftedAvatar
                            key={`read-message-${u._id}`}
                            user={u}
                            avatarStyle={styles.messageReadAvatar}
                            textStyle={styles.messageReadAvatarText}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

function ChatActions({actionsProps, theme}: {actionsProps: ActionsProps; theme: Theme}): JSX.Element {
    const styles = themedStyles(theme);
    return (
        <>
            {DEBUG_MODE && (
                <Actions
                    {...actionsProps}
                    containerStyle={styles.actionContainer}
                    icon={() => <MaterialIcons style={styles.actionIcon} name="photo-camera" />}
                    options={{
                        "Send a picture": async () => {
                            await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [1, 1],
                                //quality: AVATAR_QUALITY,
                            });
                        },
                    }}
                />
            )}
            {DEBUG_MODE && (
                <Actions
                    {...actionsProps}
                    containerStyle={styles.actionContainer}
                    icon={() => <MaterialIcons style={styles.actionIcon} name="build" />}
                    options={{
                        "Spam Lorem Ipsum": async () => {
                            const text =
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dosum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";
                            const words = text.split(" ");
                            let i = 0;
                            while (i < words.length) {
                                const n = 1 + Math.min(Math.floor(Math.random() * 12), words.length - 1 - i);
                                const msg = words.slice(i, i + n).join(" ");
                                const id = GiftedChat.defaultProps.messageIdGenerator();
                                (store.dispatch as MyThunkDispatch)(sendChatMessage(id, msg, new Date()));
                                i += n;
                            }
                        },
                    }}
                />
            )}
        </>
    );
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
        },
        inputToolbarContainer: {
            justifyContent: "center",
            borderTopWidth: 0,
            backgroundColor: theme.background,
        },
        inputToolbarPrimary: {
            alignItems: "flex-end",
        },
        textInput: {
            backgroundColor: theme.cardBackground,
            //borderWidth: 1,
            //borderColor: theme.cardBackground,
            borderRadius: 20,
            marginVertical: INPUT_VERTICAL_MARGIN,
            marginHorizontal: 20,
            paddingHorizontal: 15,
            paddingTop: 10,
            paddingBottom: 10,
            fontSize: 15,
            flex: 1,
            alignItems: "center",
            alignSelf: "flex-end",
            color: theme.text,
        },
        send: {
            fontSize: 30,
            color: theme.accent,
        },
        sendContainer: {
            height: MIN_INPUT_HEIGHT,
            justifyContent: "center",
            marginVertical: INPUT_VERTICAL_MARGIN,
            marginRight: 10,
        },
        actionContainer: {
            height: MIN_INPUT_HEIGHT,
            justifyContent: "center",
        },
        actionIcon: {
            fontSize: 28,
            width: 28,
            height: 28,
            color: theme.text,
        },
        bubbleWrapperLeft: {
            backgroundColor: theme.chatBubble,
        },
        bubbleWrapperRight: {},
        bubbleTextLeft: {
            color: theme.text,
        },
        bubbleTextRight: {},
        messageContainerLeft: {},
        messageContainerRight: {
            paddingRight: 20,
        },
        messageReadContainerLeft: {
            position: "absolute",
            right: 5,
            bottom: 3,
        },
        messageReadContainerRight: {
            position: "absolute",
            right: 5,
            bottom: 3,
        },
        messageReadAvatar: {
            width: 20,
            height: 20,
        },
        messageReadAvatarText: {
            fontSize: 12,
        },
        messageTicksContainer: {
            marginRight: 4,
            minWidth: 15,
        },
        messageTick: {
            fontSize: 14,
            color: theme.textWhite,
        },
    });
});

export default reduxConnector(withTheme(ChatScreen));
