import * as React from "react";
import {Text, View, StyleSheet} from "react-native";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {ChatRoom, ChatRoomUser} from "../../model/chat-room";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {GiftedAvatar} from "react-native-gifted-chat";
import {rootNavigate} from "../../navigation/utils";
import SwipeableCard, {SwipeActionButtons, SwipeActionProps} from "../SwipeableCard";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    localChatUser: state.messaging.localChatUser,
}));

// Component props
export type ChatRoomCardProps = {
    room: ChatRoom;
    onPress?: () => void;
    onHidden?: () => void;
} & ConnectedProps<typeof reduxConnector> &
    ThemeProps;

const LOOKS = {
    sideMargin: 15,
    verticalSpacing: 5,
    borderRadius: 10,
    minHeight: 75,
};

class ChatRoomCard extends React.Component<ChatRoomCardProps> {
    private getActions(hideCard: () => void): SwipeActionProps[] {
        const {theme} = this.props;

        return [
            {
                icon: "notifications-off",
                backgroundColor: "#ccc",
            },
            {
                icon: "report",
                backgroundColor: theme.warn,
            },
            {
                icon: "close",
                backgroundColor: theme.error,
                onPress: () => hideCard(),
            },
        ];
    }

    render() {
        const {theme, room, onPress, localChatUser} = this.props;
        const styles = themedStyles(theme);

        const localUser = room.users.find((p: ChatRoomUser) => p._id === localChatUser?._id);
        const user = room.users.filter((p: ChatRoomUser) => p._id !== localChatUser?._id)[0];

        let lastMessageComponent = <></>;

        if (room.lastMessage) {
            const date = room.lastMessage.createdAt;
            const isRead =
                localUser &&
                localUser.lastMessageSeenDate &&
                (localUser.lastMessageSeenDate >= date || localUser.lastMessageSeenId == room.lastMessage._id);
            const pad = (num: number) => (num + "").padStart(2, "0");
            lastMessageComponent = (
                <>
                    <Text style={[styles.lastMessageText, isRead ? {} : styles.lastMessageTextNew]} numberOfLines={1}>
                        {room.lastMessage.user.name.split(" ")[0]}: {room.lastMessage.text}
                    </Text>
                    <Text style={styles.lastMessageTime}>
                        {pad(date.getHours())}:{pad(date.getMinutes())}
                    </Text>
                </>
            );
        } else {
            lastMessageComponent = (
                <Text style={styles.noMessageText} numberOfLines={1}>
                    {room.users.length === 2 ? `Say hi to ${user.name}!` : "Say hi"}
                </Text>
            );
        }

        return (
            <SwipeableCard
                looks={LOOKS}
                rightThreshold={100}
                overshootRight={false}
                rightActions={(hideCard) => (
                    <SwipeActionButtons
                        id={`room-${room.id}`}
                        looks={LOOKS}
                        side="right"
                        actions={this.getActions(hideCard)}
                    />
                )}
                onPress={() => {
                    if (onPress) onPress();
                    rootNavigate("ChatScreen", {roomId: room.id});
                }}
            >
                <View style={styles.cardContent}>
                    <View style={styles.avatarContainer}>
                        <GiftedAvatar avatarStyle={styles.avatar} user={user}></GiftedAvatar>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{user.name}</Text>
                        <View style={styles.lastMessage}>{lastMessageComponent}</View>
                    </View>
                </View>
            </SwipeableCard>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        cardContent: {
            flexDirection: "row",
            padding: 10,
        },
        avatarContainer: {
            justifyContent: "center",
        },
        avatar: {
            backgroundColor: theme.accentSecondary,
            width: 45,
            height: 45,
            borderRadius: 50,
        },
        infoContainer: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 10,
        },
        name: {
            fontSize: 18,
            letterSpacing: 0.5,
            color: theme.text,
        },
        lastMessage: {
            flexDirection: "row",
            justifyContent: "space-between",
            overflow: "hidden",
        },
        noMessageText: {
            color: theme.textLight,
            fontSize: 14,
            flex: 1,
        },
        lastMessageText: {
            color: theme.text,
            fontSize: 14,
            flex: 1,
        },
        lastMessageTextNew: {
            fontWeight: "bold",
        },
        lastMessageTime: {
            color: theme.textLight,
            fontSize: 14,
        },
    });
});

export default reduxConnector(withTheme(ChatRoomCard));
