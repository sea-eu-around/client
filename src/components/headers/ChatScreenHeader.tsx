import * as React from "react";
import {StyleSheet} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {GiftedAvatar} from "react-native-gifted-chat";
import {ChatRoom, ChatRoomUser} from "../../model/chat-room";
import {headerStyles} from "../../styles/headers";
import {getRouteParams, rootNavigate} from "../../navigation/utils";
import MainHeader, {MainHeaderStackProps} from "./MainHeader";
import {RootNavigatorScreens} from "../../navigation/types";
import {StackScreenProps} from "@react-navigation/stack";
import store from "../../state/store";
import {Route} from "@react-navigation/native";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    rooms: store.getState().messaging.matchRooms,
    activeRoomId: store.getState().messaging.activeRoomId,
    profileId: state.profile.user?.profile?.id,
}));

// Component props
export type ChatScreenHeaderProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<RootNavigatorScreens> &
    Omit<MainHeaderStackProps, "route">;

class ChatScreenHeaderClass extends React.Component<ChatScreenHeaderProps> {
    private getRoomId(): string | null {
        // Get the room ID from the route parameters
        const {roomId} = getRouteParams(this.props.route);
        return (roomId as string) || null;
    }

    private getRoom(): ChatRoom | null {
        const {rooms, activeRoomId} = this.props;
        const id = activeRoomId || this.getRoomId();
        return id ? rooms[id] : null;
    }

    render(): JSX.Element {
        const {theme, profileId, ...stackProps} = this.props;
        const styles = themedStyles(theme);
        const hstyles = headerStyles(theme);

        const room = this.getRoom();

        if (room) {
            const user = room.users.filter((p: ChatRoomUser) => p._id != profileId)[0];
            return (
                <MainHeader
                    {...stackProps}
                    route={stackProps.route as Route<string, undefined>}
                    backButton={true}
                    blur={true}
                    overrideAvatar={
                        <GiftedAvatar
                            avatarStyle={hstyles.avatarContainer}
                            user={user}
                            onPress={() => rootNavigate("ProfileScreen", {id: user._id})}
                        />
                    }
                    overrideTitle={user.name}
                    titleStyle={styles.name}
                />
            );
        } else return <></>;
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        name: {
            fontSize: 18,
            fontWeight: "600",
        },
    });
});

const ChatScreenHeaderComp = reduxConnector(withTheme(ChatScreenHeaderClass));

export default function ChatScreenHeader(
    props: StackScreenProps<RootNavigatorScreens> & MainHeaderStackProps,
): JSX.Element {
    return <ChatScreenHeaderComp {...props} />;
}
