import * as React from "react";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../../types";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import {FontAwesome} from "@expo/vector-icons";
import {ChatRoomUser} from "../../model/chat-room";
import {MainTabBarIcon} from "./MainTabBar";
import {View, StyleSheet} from "react-native";
import {preTheme} from "../../styles/utils";

const reduxConnector = connect(({messaging}: AppState) => ({
    firstRoom:
        messaging.matchRoomsOrdered.length > 0 ? messaging.matchRooms[messaging.matchRoomsOrdered[0]] : undefined,
    localChatUser: messaging.localChatUser,
}));

const INDICATOR_SIZE = 16;

export type MessagingTabIconProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps & {focused: boolean; color: string; size: number};

class MessagingTabIcon extends React.Component<MessagingTabIconProps> {
    render(): JSX.Element {
        const {firstRoom, localChatUser, theme, ...props} = this.props;
        const styles = themedStyles(theme);

        const localUser = firstRoom && firstRoom.users.find((p: ChatRoomUser) => p._id === localChatUser?._id);
        const lastMessage = firstRoom?.lastMessage;

        // Check if there is an unread message
        // Since we keep rooms ordered by most recent activity, if there is an unread message it will be on the first room
        const isNotRead =
            lastMessage &&
            localUser &&
            ((localUser.lastMessageSeenDate !== null && localUser.lastMessageSeenDate < lastMessage.createdAt) ||
                localUser.lastMessageSeenId != lastMessage._id);

        const icon = <MainTabBarIcon name="message" {...props} />;
        let indicator = <></>;

        if (isNotRead) {
            indicator = (
                <View style={styles.indicatorContainer}>
                    <FontAwesome size={INDICATOR_SIZE - 4} name="exclamation" color={theme.textWhite} />
                </View>
            );
        }

        return (
            <View>
                {icon}
                {indicator}
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        indicatorContainer: {
            position: "absolute",
            backgroundColor: theme.error,
            width: INDICATOR_SIZE,
            height: INDICATOR_SIZE,
            borderRadius: INDICATOR_SIZE,
            justifyContent: "center",
            alignItems: "center",
            left: 18,
            bottom: 15,
        },
    });
});

export default reduxConnector(withTheme(MessagingTabIcon));
