import {MaterialIcons} from "@expo/vector-icons";
import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, View} from "react-native";
import {withTheme} from "react-native-elements";
import {GiftedChat, IMessage, InputToolbar, InputToolbarProps, Send, SendProps} from "react-native-gifted-chat";
import {connect, ConnectedProps} from "react-redux";
import {RootNavigatorScreens} from "../../navigation/types";
import {leaveChatRoom, sendChatMessage} from "../../state/messaging/actions";
import {AppState, MyThunkDispatch} from "../../state/types";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    activeRoom: state.messaging.activeRoom,
    localChatUser: state.messaging.localChatUser,
}));

// Component props
export type ChatScreenProps = ThemeProps &
    ConnectedProps<typeof reduxConnector> &
    StackScreenProps<RootNavigatorScreens>;

class ChatScreen extends React.Component<ChatScreenProps> {
    componentDidMount() {
        this.props.navigation.addListener("blur", () => this.onBlur());
    }

    onBlur() {
        const {dispatch, activeRoom} = this.props;
        if (activeRoom) (dispatch as MyThunkDispatch)(leaveChatRoom(activeRoom));
    }

    render(): JSX.Element {
        const {theme, activeRoom, localChatUser, dispatch} = this.props;
        const styles = themedStyles(theme);

        let chatComponent = <></>;
        if (activeRoom && localChatUser) {
            chatComponent = (
                <GiftedChat
                    messages={activeRoom.messages}
                    user={localChatUser}
                    renderSend={(props: SendProps<IMessage>) => (
                        <Send {...props} containerStyle={styles.sendContainer}>
                            <MaterialIcons name="send" style={styles.send} />
                        </Send>
                    )}
                    renderInputToolbar={(props: InputToolbarProps) => (
                        <InputToolbar
                            {...props}
                            containerStyle={styles.inputToolbarContainer}
                            primaryStyle={styles.inputToolbarPrimary}
                        />
                    )}
                    timeFormat={"HH:mm"}
                    onSend={(messages) => {
                        messages.forEach((m) =>
                            (dispatch as MyThunkDispatch)(sendChatMessage(m._id + "", m.text, m.createdAt)),
                        );
                    }}
                />
            );
        }

        return <View style={styles.container}>{chatComponent}</View>;
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            justifyContent: "center",
        },
        inputToolbarContainer: {
            justifyContent: "center",
        },
        inputToolbarPrimary: {},
        sendContainer: {
            justifyContent: "center",
        },
        send: {
            fontSize: 30,
            color: theme.accent,
            paddingHorizontal: 12,
        },
    });
});

export default reduxConnector(withTheme(ChatScreen));
