import * as React from "react";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../../types";
import {StackHeaderProps} from "@react-navigation/stack";
import {preTheme} from "../../styles/utils";
import {MaterialIcons} from "@expo/vector-icons";
import {GiftedAvatar} from "react-native-gifted-chat";
import {ChatRoomUser} from "../../model/chat-room";
import {headerStyles} from "../../styles/headers";
import {rootNavigate} from "../../navigation/utils";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    activeRoom: state.messaging.activeRoom,
    profileId: state.profile.user?.profile?.id,
}));

// Component props
export type ChatScreenHeaderProps = ConnectedProps<typeof reduxConnector> & ThemeProps & StackHeaderProps;

class ChatScreenHeaderClass extends React.Component<ChatScreenHeaderProps> {
    back() {
        rootNavigate("TabMessaging");
    }

    render(): JSX.Element {
        const {theme, activeRoom, profileId, insets} = this.props;
        const styles = themedStyles(theme);
        const hstyles = headerStyles(theme);

        if (activeRoom) {
            const user = activeRoom.users.filter((p: ChatRoomUser) => p._id != profileId)[0];
            return (
                <View style={[{paddingTop: insets.top}, hstyles.wrapper]}>
                    <View style={hstyles.container}>
                        <TouchableOpacity style={hstyles.backButton} onPress={() => this.back()}>
                            <MaterialIcons style={[hstyles.backButtonIcon, {color: theme.text}]} name="arrow-back" />
                        </TouchableOpacity>
                        <GiftedAvatar
                            avatarStyle={[hstyles.avatarContainer, styles.avatar]}
                            user={user}
                            onPress={() => rootNavigate("ProfileScreen", {id: user._id})}
                        />
                        <Text style={styles.name} numberOfLines={1}>
                            {user.name}
                        </Text>
                    </View>
                </View>
            );
        } else return <></>;
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        avatar: {
            marginRight: 10,
        },
        name: {
            flex: 1,
            fontSize: 18,
            color: theme.text,
        },
    });
});

const ChatScreenHeaderComp = reduxConnector(withTheme(ChatScreenHeaderClass));

export default function ChatScreenHeader(props: StackHeaderProps): JSX.Element {
    return <ChatScreenHeaderComp {...props} />;
}
