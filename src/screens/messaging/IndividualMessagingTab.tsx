import * as React from "react";
import {
    ScrollView,
    View,
    StyleSheet,
    Text,
    RefreshControl,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from "react-native";
import {AppState, MyThunkDispatch} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import i18n from "i18n-js";
import {fetchMatchRooms, refreshMatchRooms} from "../../state/messaging/actions";
import ChatRoomCard from "../../components/messaging/ChatRoomCard";
import {ROOMS_FETCH_LIMIT} from "../../constants/config";
import ScreenWrapper from "../ScreenWrapper";
import {StackScreenProps} from "@react-navigation/stack";
import {TabMessagingRoot} from "../../navigation/types";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    rooms: state.messaging.matchRooms,
    roomIds: state.messaging.matchRoomsOrdered,
    fetchingRooms: state.messaging.matchRoomsPagination.fetching,
}));

type IndividualMessagingTabProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<TabMessagingRoot>;

const SCROLL_DISTANCE_TO_LOAD = 50;

// TODO rename IndividualMessagingTab
class IndividualMessagingTab extends React.Component<IndividualMessagingTabProps> {
    fetchMore() {
        const {fetchingRooms, dispatch} = this.props;
        if (!fetchingRooms) (dispatch as MyThunkDispatch)(fetchMatchRooms());
    }

    componentDidMount() {
        this.props.navigation.addListener("focus", () => this.onFocus());
        this.onFocus();
    }

    onFocus() {
        if (this.props.roomIds.length < ROOMS_FETCH_LIMIT) this.fetchMore();
    }

    componentDidUpdate() {
        const {roomIds, navigation} = this.props;
        if (navigation.isFocused() && roomIds.length < ROOMS_FETCH_LIMIT) this.fetchMore();
    }

    render(): JSX.Element {
        const {theme, rooms, roomIds, fetchingRooms, dispatch} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={fetchingRooms}
                            onRefresh={() => (dispatch as MyThunkDispatch)(refreshMatchRooms())}
                        />
                    }
                    onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                        const {layoutMeasurement, contentOffset, contentSize} = e.nativeEvent;
                        const distanceToBottom = contentSize.height - contentOffset.y - layoutMeasurement.height;
                        if (distanceToBottom < SCROLL_DISTANCE_TO_LOAD) this.fetchMore();
                    }}
                >
                    {roomIds.map((id: string) => (
                        <ChatRoomCard key={id} room={rooms[id]} />
                    ))}
                    {!fetchingRooms && roomIds.length == 0 && (
                        <View style={styles.noMatchesContainer}>
                            <Text style={styles.noMatchesText}>{i18n.t("messaging.noMatches")}</Text>
                        </View>
                    )}
                </ScrollView>
            </ScreenWrapper>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        scroll: {
            width: "100%",
        },
        scrollContent: {
            paddingTop: 20,
            paddingBottom: 40,
        },
        noMatchesContainer: {
            width: "80%",
            alignSelf: "center",
            marginVertical: 40,
        },
        noMatchesText: {
            color: theme.text,
            letterSpacing: 0.5,
            fontSize: 18,
            lineHeight: 24,
            textAlign: "center",
        },

        // Search bar
        searchBarContainer: {
            width: "90%",
            marginBottom: 10,
        },
        searchBarInputContainer: {
            height: 45,
            backgroundColor: theme.cardBackground,
            elevation: 2,
        },
    });
});

export default reduxConnector(withTheme(IndividualMessagingTab));
