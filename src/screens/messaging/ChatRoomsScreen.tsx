import * as React from "react";
import {StyleSheet, Text} from "react-native";
import {AppState, MyThunkDispatch} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import i18n from "i18n-js";
import {fetchMatchRooms, refreshMatchRooms} from "../../state/messaging/actions";
import ChatRoomCard from "../../components/cards/ChatRoomCard";
import {ROOMS_FETCH_LIMIT} from "../../constants/config";
import ScreenWrapper from "../ScreenWrapper";
import {StackScreenProps} from "@react-navigation/stack";
import {TabMessagingRoot} from "../../navigation/types";
import InfiniteScroller from "../../components/InfiniteScroller";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    rooms: state.messaging.matchRooms,
    roomIds: state.messaging.matchRoomsOrdered,
    fetchingRooms: state.messaging.matchRoomsPagination.fetching,
    currentPage: state.messaging.matchRoomsPagination.page,
}));

type ChatRoomsScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps & StackScreenProps<TabMessagingRoot>;

class ChatRoomsScreen extends React.Component<ChatRoomsScreenProps> {
    render(): JSX.Element {
        const {theme, rooms, roomIds, fetchingRooms, currentPage, navigation, dispatch} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <InfiniteScroller
                    navigation={navigation}
                    fetchLimit={ROOMS_FETCH_LIMIT}
                    fetchMore={() => (dispatch as MyThunkDispatch)(fetchMatchRooms())}
                    fetching={fetchingRooms}
                    currentPage={currentPage}
                    items={roomIds}
                    id={(roomId: string): string => roomId}
                    noResultsComponent={<Text style={styles.noMatchesText}>{i18n.t("messaging.noMatches")}</Text>}
                    refresh={() => dispatch(refreshMatchRooms())}
                    renderItem={(roomId: string) => (
                        <ChatRoomCard key={`chat-room-card-${roomId}`} room={rooms[roomId]} />
                    )}
                />
            </ScreenWrapper>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        noMatchesText: {
            color: theme.text,
            letterSpacing: 0.5,
            fontSize: 18,
            lineHeight: 24,
            textAlign: "center",
            paddingHorizontal: 50,
        },
    });
});

export default reduxConnector(withTheme(ChatRoomsScreen));
