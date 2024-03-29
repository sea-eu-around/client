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
    canFetchMore: state.messaging.matchRoomsPagination.canFetchMore,
    currentPage: state.messaging.matchRoomsPagination.page,
}));

type ChatRoomsScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps & StackScreenProps<TabMessagingRoot>;

class ChatRoomsScreen extends React.Component<ChatRoomsScreenProps> {
    private fetchMore(): void {
        (this.props.dispatch as MyThunkDispatch)(fetchMatchRooms());
    }

    render(): JSX.Element {
        const {theme, rooms, roomIds, fetchingRooms, canFetchMore, currentPage, navigation, dispatch} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <InfiniteScroller
                    navigation={navigation}
                    fetchLimit={ROOMS_FETCH_LIMIT}
                    fetchMore={() => this.fetchMore()}
                    fetching={fetchingRooms}
                    canFetchMore={canFetchMore}
                    currentPage={currentPage}
                    refreshOnFocus
                    refresh={() => (dispatch as MyThunkDispatch)(refreshMatchRooms())}
                    items={roomIds}
                    id={(roomId: string): string => roomId}
                    noResultsComponent={<Text style={styles.noMatchesText}>{i18n.t("messaging.noMatches")}</Text>}
                    renderItem={(roomId: string) => (
                        <ChatRoomCard key={`chat-room-card-${roomId}`} room={rooms[roomId]} />
                    )}
                    itemsContainerStyle={styles.itemsContainer}
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
        itemsContainer: {
            width: "100%",
            maxWidth: 600,
            alignSelf: "center",
        },
    });
});

export default reduxConnector(withTheme(ChatRoomsScreen));
