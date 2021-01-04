import * as React from "react";
import {StyleSheet} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {GiftedAvatar} from "react-native-gifted-chat";
import {ChatRoomUser} from "../../model/chat-room";
import {headerStyles} from "../../styles/headers";
import {rootNavigate} from "../../navigation/utils";
import MainHeader, {MainHeaderStackProps} from "./MainHeader";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    activeRoom: state.messaging.activeRoom,
    profileId: state.profile.user?.profile?.id,
}));

// Component props
export type ChatScreenHeaderProps = ConnectedProps<typeof reduxConnector> & ThemeProps & MainHeaderStackProps;

class ChatScreenHeaderClass extends React.Component<ChatScreenHeaderProps> {
    render(): JSX.Element {
        const {theme, activeRoom, profileId, ...stackProps} = this.props;
        const styles = themedStyles(theme);
        const hstyles = headerStyles(theme);

        if (activeRoom) {
            const user = activeRoom.users.filter((p: ChatRoomUser) => p._id != profileId)[0];
            return (
                <MainHeader
                    {...stackProps}
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

export default function ChatScreenHeader(props: MainHeaderStackProps): JSX.Element {
    return <ChatScreenHeaderComp {...props} />;
}
