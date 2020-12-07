import {MaterialIcons} from "@expo/vector-icons";
import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, View} from "react-native";
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
    fetchEarlierMessages,
    fetchMatchRoom,
    joinChatRoom,
    leaveChatRoom,
    sendChatMessage,
} from "../../state/messaging/actions";
import {AppState, MyThunkDispatch} from "../../state/types";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import {TypingAnimation} from "react-native-typing-animation";
import {ChatRoomUser} from "../../model/chat-room";
import store from "../../state/store";
import {MESSAGES_FETCH_LIMIT} from "../../constants/config";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    activeRoom: state.messaging.activeRoom,
    localChatUser: state.messaging.localChatUser,
    connected: state.messaging.socketState.connected,
    connecting: state.messaging.socketState.connecting,
}));

// Component props
export type ChatScreenProps = ThemeProps &
    ConnectedProps<typeof reduxConnector> &
    StackScreenProps<RootNavigatorScreens>;

const MIN_INPUT_HEIGHT = 45;
const INPUT_VERTICAL_MARGIN = 10;

class ChatScreen extends React.Component<ChatScreenProps> {
    ref = React.createRef<GiftedChat>();

    connectToRoom() {
        const {route} = this.props;
        const dispatch = this.props.dispatch as MyThunkDispatch;

        // Get the room ID from the route parameters
        if (route.params) {
            const params = route.params as {[key: string]: string};
            const {roomId} = params;

            // If a roomId parameter was given, we first ensure we have that room (in storage or we fetch it) before joining it.
            if (roomId) {
                const room = store.getState().messaging.matchRooms.find((r) => r.id === roomId);
                if (room) dispatch(joinChatRoom(room));
                else {
                    dispatch(fetchMatchRoom(roomId)).then((r) => {
                        if (r) dispatch(joinChatRoom(r));
                    });
                }
            }
        }
    }

    componentDidMount() {
        const {connected, connecting, dispatch} = this.props;

        // If are already connected to the chat, connect to the room
        if (connected) this.connectToRoom();
        // If we are not connected nor connecting to the chat, connect to the chat first
        else if (!connecting) (dispatch as MyThunkDispatch)(connectToChat());

        this.props.navigation.addListener("blur", () => this.onBlur());
        this.props.navigation.addListener("focus", () => this.onFocus());
        this.onFocus();
    }

    onBlur() {
        // Leave the room when navigating to another screen
        const {dispatch, activeRoom} = this.props;
        if (activeRoom) (dispatch as MyThunkDispatch)(leaveChatRoom(activeRoom));
    }

    onFocus() {
        // Fetch earlier messages if we need to
        const room = this.props.activeRoom;
        if (room && room.messages.length < MESSAGES_FETCH_LIMIT) this.fetchEarlier();
    }

    componentDidUpdate(oldProps: ChatScreenProps) {
        const {activeRoom, connected} = this.props;
        // If we've just connected to the chat, connect to the room
        if (!oldProps.connected && connected) this.connectToRoom();
        // If we're at the beginning of the messages pagination
        if (!oldProps.activeRoom && activeRoom && activeRoom.messagePagination.page == 1) this.fetchEarlier();
    }

    fetchEarlier() {
        const {dispatch, activeRoom} = this.props;
        if (activeRoom && !activeRoom.messagePagination.fetching)
            (dispatch as MyThunkDispatch)(fetchEarlierMessages(activeRoom));
    }

    render(): JSX.Element {
        const {theme, localChatUser, dispatch} = this.props;
        const styles = themedStyles(theme);

        const room = this.props.activeRoom;
        let chatComponent = <></>;
        if (room && localChatUser) {
            const isWritingId = Object.keys(room.writing).find((id: string) => room.writing[id] === true);
            const userWriting = isWritingId ? room.users.find((u) => u._id == isWritingId) : undefined;

            const lastMessageDict: {[key: string]: ChatRoomUser[]} = {};
            if (room.messages.length > 0) {
                room.users.forEach((u: ChatRoomUser) => {
                    if (u._id != localChatUser._id && u.lastMessageSeenId) {
                        /*let i = 0;
                        while (i < room.messages.length - 1 && room.messages[i].createdAt >= u.lastMessageSeenDate) i++;

                        const m = i < room.messages.length - 1 ? room.messages[i] : room.lastMessage;
                        console.log("ROOM USERS:", room.users);
                        console.log("MESSAGE:", m);
                        if (m) {
                            if (lastMessageDict[m._id]) lastMessageDict[m._id].push(u);
                            else lastMessageDict[m._id] = [u];
                        }*/
                        console.log(u.lastMessageSeenId);
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
                            textStyle={{left: styles.bubbleTextLeft, right: styles.bubbleTextRight}}
                            wrapperStyle={{left: styles.bubbleWrapperLeft, right: styles.bubbleWrapperRight}}
                        />
                    )}
                    renderMessage={(props: MessageProps<IMessage>) => {
                        const lm = props.currentMessage ? lastMessageDict[props.currentMessage._id] : undefined;
                        return lm ? (
                            <View>
                                <Message {...props} containerStyle={{right: {marginBottom: 0}, left: {}}} />
                                <View style={styles.messageReadContainer}>
                                    {lm.map((u: ChatRoomUser) => (
                                        <GiftedAvatar
                                            key={`read-message-${u._id}`}
                                            user={u}
                                            avatarStyle={styles.messageReadAvatar}
                                            textStyle={styles.messageReadAvatarText}
                                        />
                                    ))}
                                </View>
                            </View>
                        ) : (
                            <Message {...props} />
                        );
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
                        //onEndReachedThreshold: 1,
                    }}
                    textInputProps={{autoFocus: false, style: styles.textInput}}
                    minInputToolbarHeight={MIN_INPUT_HEIGHT + INPUT_VERTICAL_MARGIN * 2}
                />
            );
        }

        return <View style={styles.container}>{chatComponent}</View>;
    }
}

function ChatFooter({userWriting, theme}: {userWriting?: ChatRoomUser; theme: Theme}): JSX.Element {
    if (userWriting) {
        return (
            <View style={{height: 50, paddingTop: 10}}>
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

function ChatActions({actionsProps, theme}: {actionsProps: ActionsProps; theme: Theme}): JSX.Element {
    const styles = themedStyles(theme);
    return (
        <>
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
            ></Actions>
            <Actions
                {...actionsProps}
                containerStyle={styles.actionContainer}
                icon={() => <MaterialIcons style={styles.actionIcon} name="build" />}
                options={{
                    "Spam Lorem Ipsum": async () => {
                        const text =
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";
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
            ></Actions>
        </>
    );
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.cardBackground,
            justifyContent: "center",
        },
        inputToolbarContainer: {
            justifyContent: "center",
            borderTopWidth: 0,
            backgroundColor: theme.cardBackground,
        },
        inputToolbarPrimary: {
            alignItems: "flex-end",
        },
        textInput: {
            backgroundColor: theme.cardBackground,
            borderWidth: 1,
            borderColor: theme.componentBorder,
            borderRadius: 20,
            marginVertical: INPUT_VERTICAL_MARGIN,
            marginHorizontal: 20,
            minHeight: MIN_INPUT_HEIGHT,
            paddingHorizontal: 15,
            paddingVertical: 5,
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
        messageReadContainer: {
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingRight: 8,
            paddingTop: 2,
            paddingBottom: 8,
        },
        messageReadAvatar: {
            width: 20,
            height: 20,
        },
        messageReadAvatarText: {
            fontSize: 12,
        },
    });
});

export default reduxConnector(withTheme(ChatScreen));
