import * as React from "react";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {StackHeaderProps} from "@react-navigation/stack";
import {SafeAreaInsetsContext} from "react-native-safe-area-context";
import {preTheme} from "../styles/utils";
import {MaterialIcons} from "@expo/vector-icons";
import {GiftedAvatar} from "react-native-gifted-chat";
import {ChatRoomUser} from "../model/chat-room";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    activeRoom: state.messaging.activeRoom,
    profileId: state.profile.user?.profile?.id,
}));

// Component props
export type ChatScreenHeaderProps = {topInset: number} & ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackHeaderProps;

// Component state

class ChatScreenHeaderClass extends React.Component<ChatScreenHeaderProps> {
    back() {
        const nav = this.props.navigation;
        if (nav.canGoBack()) nav.goBack();
    }

    render(): JSX.Element {
        const {theme, activeRoom, profileId, topInset} = this.props;
        const styles = themedStyles(theme);

        if (activeRoom) {
            const user = activeRoom.users.filter((p: ChatRoomUser) => p._id != profileId)[0];
            return (
                <View style={[{paddingTop: topInset}, styles.wrapper]}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.backButton} onPress={() => this.back()}>
                            <MaterialIcons style={styles.backButtonIcon} name="keyboard-backspace"></MaterialIcons>
                        </TouchableOpacity>
                        <GiftedAvatar avatarStyle={styles.avatar} user={user}></GiftedAvatar>
                        <Text style={styles.name} numberOfLines={1}>
                            {user.name /* + " this is a very long username"*/}
                        </Text>
                    </View>
                </View>
            );
        } else return <></>;
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            backgroundColor: theme.background,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,
            elevation: 3,
        },
        container: {
            flexDirection: "row",
            alignItems: "center",
            height: 60,
            paddingRight: 20,
        },
        backButton: {
            width: 55,
            height: 55,
            justifyContent: "center",
            alignItems: "center",
        },
        backButtonIcon: {
            fontSize: 32,
        },
        avatar: {
            width: 40,
            height: 40,
            marginLeft: 5,
            marginRight: 10,
            borderWidth: 1,
            borderColor: theme.accentSlight,
        },
        name: {
            flex: 1,
            fontSize: 17,
            color: theme.text,
        },
    });
});

const ChatScreenHeaderComp = reduxConnector(withTheme(ChatScreenHeaderClass));

function ChatScreenHeader(props: StackHeaderProps): JSX.Element {
    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => <ChatScreenHeaderComp {...props} topInset={insets ? insets.top : 0} />}
        </SafeAreaInsetsContext.Consumer>
    );
}

export default ChatScreenHeader;
