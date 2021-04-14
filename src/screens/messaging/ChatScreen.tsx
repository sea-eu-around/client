import {MaterialIcons} from "@expo/vector-icons";
import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {
    Platform,
    ScrollView,
    ScrollViewProps,
    StyleSheet,
    TextStyle,
    View,
    FlatList,
    KeyboardAvoidingView,
    Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {withTheme} from "react-native-elements";
import {
    Actions,
    ActionsProps,
    Bubble,
    BubbleProps,
    Composer,
    ComposerProps,
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
import {DEBUG_MODE, MESSAGES_FETCH_LIMIT} from "../../constants/config";
import ScreenWrapper from "../ScreenWrapper";
import {normalizeWheelEvent} from "../../polyfills";
import {getRouteParams} from "../../navigation/utils";
import {noop} from "lodash";
import ChatUserAvatar from "../../components/ChatUserAvatar";
import themes from "../../constants/themes";
import {getLocalSvg} from "../../assets";
import i18n from "i18n-js";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    rooms: state.messaging.matchRooms,
    activeRoomId: state.messaging.activeRoomId,
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
    listRef: FlatList | null = null;
    removeScrollListener: () => void = noop;

    private unsubscribeBlurEvent: null | (() => void) = null;
    private unsubscribeFocusEvent: null | (() => void) = null;

    private getRoomId(): string | null {
        // Get the room ID from the route parameters
        const {roomId} = getRouteParams(this.props.route);
        return (roomId as string) || null;
    }

    private getRoom(): ChatRoom | null {
        const {rooms, activeRoomId} = this.props;
        const id = activeRoomId || this.getRoomId();
        return id ? rooms[id] || null : null;
    }

    private connectToRoom(): void {
        const {rooms} = this.props;
        const dispatch = this.props.dispatch as MyThunkDispatch;

        const joinRoom = (room: ChatRoom) => dispatch(joinChatRoom(room));

        const roomId = this.getRoomId();
        // If a roomId parameter was given
        if (roomId) {
            const room = rooms[roomId];
            // First ensure we have that room (in storage or we fetch it) before joining it.
            if (room) joinRoom(room);
            else dispatch(fetchMatchRoom(roomId)).then((room) => room && joinRoom(room));
        }
    }

    componentDidMount(): void {
        const {navigation} = this.props;
        this.unsubscribeBlurEvent = navigation.addListener("blur", () => this.onBlur());
        this.unsubscribeFocusEvent = navigation.addListener("focus", () => this.onFocus());
        this.onFocus();
    }

    componentWillUnmount(): void {
        if (this.unsubscribeBlurEvent) this.unsubscribeBlurEvent();
        if (this.unsubscribeFocusEvent) this.unsubscribeFocusEvent();
    }

    componentDidUpdate(oldProps: ChatScreenProps): void {
        const {activeRoomId, connected} = this.props;
        // If we've just connected to the chat, connect to the room
        if (!oldProps.connected && connected) this.connectToRoom();
        // If we've just joined the room, ensure we have the latest messages
        if (!oldProps.activeRoomId && activeRoomId) this.ensureLatestMessages();
    }

    private onBlur(): void {
        // Leave the room when navigating to another screen
        const {dispatch} = this.props;
        const room = this.getRoom();
        if (room) (dispatch as MyThunkDispatch)(leaveChatRoom(room));
    }

    private onFocus(): void {
        const {dispatch} = this.props;

        // If we are already connected to the chat, connect to the room
        if (chatSocket.isConnected()) this.connectToRoom();
        // If we are not connected nor connecting to the chat, connect to the chat first
        else if (!chatSocket.isConnecting()) (dispatch as MyThunkDispatch)(connectToChat());
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

    private setListRef(listRef: FlatList | null): void {
        if (Platform.OS === "web") {
            if (listRef === null) this.removeScrollListener();
            else if (this.listRef === null) {
                // fix scrolling being reversed with the mouse wheel
                // taken from https://www.gitmemory.com/issue/necolas/react-native-web/995/511242048
                const scrollNode = listRef.getScrollableNode();
                const listener = scrollNode.addEventListener("wheel", (e: WheelEvent) => {
                    const r = normalizeWheelEvent(e);
                    scrollNode.scrollTop -= r.pixelY * 0.15;
                    e.preventDefault();
                });
                this.removeScrollListener = () => scrollNode.removeEventListener("wheel", listener);
                listRef.setNativeProps({style: {transform: "translate3d(0,0,0) scaleY(-1)"}});
            }
            this.listRef = listRef;
        }
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

            const otherUser = room.users.filter((p: ChatRoomUser) => p._id != localChatUser._id)[0];

            const ChatEmptySvg =
                room.messages.length === 0 ? getLocalSvg("man-holding-phone", () => this.forceUpdate()) : null;
            const chatEmptySvgHeight = 250;

            chatComponent = (
                <GiftedChat
                    ref={this.ref}
                    isKeyboardInternallyHandled={false}
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
                    renderChatEmpty={() => (
                        <View style={styles.emptyChatContainer}>
                            <Text style={styles.emptyChatText}>
                                {i18n.t("messaging.sayHiTo", {name: otherUser.name})}
                            </Text>
                            {ChatEmptySvg && (
                                <ChatEmptySvg
                                    style={{
                                        transform: Platform.OS === "web" ? ("scaleY(-1)" as never) : [{scaleY: -1}],
                                    }}
                                    width={chatEmptySvgHeight * (150 / 200)}
                                    height={chatEmptySvgHeight}
                                    viewBox="0 0 150 200"
                                    preserveAspectRatio="xMaxYMid"
                                />
                            )}
                        </View>
                    )}
                    renderFooter={() => <ChatFooter userWriting={userWriting} theme={theme} />}
                    renderActions={(props: ActionsProps) => <ChatActions actionsProps={props} theme={theme} />}
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
                        ref: (el: unknown) => this.setListRef(el as FlatList | null),
                        onEndReached: () => this.fetchEarlier(),
                        renderScrollComponent: (props: ScrollViewProps) => (
                            <ScrollView
                                {...props}
                                contentContainerStyle={[
                                    props.contentContainerStyle,
                                    // This is actually a paddingTop but gifted-chat flips the rendering.
                                    // (compensates for the height of the transparent header)
                                    {paddingBottom: 100},
                                ]}
                            />
                        ),
                    }}
                    renderComposer={(props: ComposerProps) => (
                        <Composer
                            {...props}
                            textInputProps={{
                                ...props.textInputProps,
                                autoFocus: false,
                                style: [styles.textInput, Platform.OS === "web" && ({outline: "none"} as TextStyle)],
                                multiline: true,
                                ...(Platform.OS === "web"
                                    ? {
                                          onFocus: () => this.forceUpdate(), // workaround to get the ugly outline on web to disappear properly
                                          onKeyPress: (ev) => {
                                              const e = (ev as unknown) as KeyboardEvent;
                                              if (e.key === "Enter" && !e.altKey && !e.shiftKey && props.text) {
                                                  // The typing expects _id, createdAt and user properties, but gifted-chat creates them itself if not given
                                                  this.ref.current?.onSend([{text: props.text.trim()} as never], true);
                                              }
                                          },
                                      }
                                    : {}),
                            }}
                        />
                    )}
                    minInputToolbarHeight={MIN_INPUT_HEIGHT + INPUT_VERTICAL_MARGIN * 2}
                />
            );
        }

        return (
            <ScreenWrapper>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
                    {chatComponent}
                </KeyboardAvoidingView>
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
                        <ChatUserAvatar
                            key={`read-message-${u._id}`}
                            titleStyle={styles.messageReadAvatarText}
                            user={u}
                            size={20}
                            rounded
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

function ChatActions({actionsProps, theme}: {actionsProps: ActionsProps; theme: Theme}): JSX.Element {
    return <></>;

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
        bubbleWrapperRight: {
            paddingLeft: 10,
        },
        bubbleTextLeft: {
            color: theme.text,
        },
        bubbleTextRight: {
            marginLeft: 0,
        },
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
        messageReadAvatarText: {
            fontSize: 12,
        },
        messageTicksContainer: {
            marginRight: 4,
            minWidth: 15,
        },
        messageTick: {
            fontSize: 14,
            color: themes.dark.text,
        },
        emptyChatContainer: {
            width: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 50,
        },
        emptyChatText: {
            fontSize: 20,
            color: theme.textLight,
            transform: [{scaleY: -1}],
            marginBottom: 20,
            textAlign: "center",
        },
    });
});

export default reduxConnector(withTheme(ChatScreen));
