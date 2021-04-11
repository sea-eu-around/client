import * as React from "react";
import {Text, View, StyleSheet} from "react-native";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {ChatRoom, ChatRoomUser} from "../../model/chat-room";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {openChat} from "../../navigation/utils";
import SwipeableCard, {SwipeableCardClass, SwipeActionButtons, SwipeActionProps} from "./SwipeableCard";
import QuickFormReport, {QuickFormReportClass} from "../forms/QuickFormReport";
import {ReportEntityType} from "../../constants/reports";
import i18n from "i18n-js";
import ChatUserAvatar from "../ChatUserAvatar";

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
    reportFormRef = React.createRef<QuickFormReportClass>();
    swipeableCardRef = React.createRef<SwipeableCardClass>();

    private getActions(hideCard: () => void): SwipeActionProps[] {
        const {theme} = this.props;

        return [
            // TODO implement chat mute
            /*{
                icon: "notifications-off",
                backgroundColor: "#ccc",
            },*/
            {
                icon: "report",
                backgroundColor: theme.error,
                onPress: () => this.reportFormRef.current?.open(),
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
                    {room.users.length === 2 ? i18n.t("messaging.sayHiTo", {name: user.name}) : i18n.t("sayHi")}
                </Text>
            );
        }

        return (
            <SwipeableCard
                ref={this.swipeableCardRef}
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
                    openChat(room.id);
                }}
            >
                <View style={styles.cardContent}>
                    <ChatUserAvatar containerStyle={styles.avatarContainer} user={user} size={45} rounded />
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{user.name}</Text>
                        <View style={styles.lastMessage}>{lastMessageComponent}</View>
                    </View>
                </View>
                <QuickFormReport
                    ref={this.reportFormRef}
                    entityType={ReportEntityType.PROFILE_ENTITY}
                    entity={user}
                    onSubmit={() => this.swipeableCardRef.current?.resetSwipe()}
                />
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
            backgroundColor: theme.accentSecondary,
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
