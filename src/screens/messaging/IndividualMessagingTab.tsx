import * as React from "react";
import {
    ScrollView,
    View,
    StyleSheet,
    Text,
    RefreshControl,
    KeyboardAvoidingView,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from "react-native";
import {AppState, MyThunkDispatch} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import i18n from "i18n-js";
import {connectToChat, fetchMatchRooms, refreshMatchRooms} from "../../state/messaging/actions";
import {MaterialTopTabScreenProps} from "@react-navigation/material-top-tabs";
import {TabMessagingRoot} from "../../navigation/types";
import {ChatRoom} from "../../model/chat-room";
import ChatRoomCard from "../../components/messaging/ChatRoomCard";
import {ROOMS_FETCH_LIMIT} from "../../constants/config";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    rooms: state.messaging.matchRooms,
    fetchingRooms: state.messaging.matchRoomsPagination.fetching,
}));

type IndividualMessagingTabProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    MaterialTopTabScreenProps<TabMessagingRoot>;

const SCROLL_DISTANCE_TO_LOAD = 50;

class IndividualMessagingTab extends React.Component<IndividualMessagingTabProps> {
    fetchMore() {
        const {fetchingRooms, dispatch} = this.props;
        if (!fetchingRooms) (dispatch as MyThunkDispatch)(fetchMatchRooms());
    }

    componentDidMount() {
        this.props.navigation.addListener("focus", () => this.onFocus());
        this.props.navigation.addListener("blur", () => this.onBlur());
        this.onFocus();
    }

    onFocus() {
        (this.props.dispatch as MyThunkDispatch)(connectToChat());
        if (this.props.rooms.length < ROOMS_FETCH_LIMIT) this.fetchMore();
    }

    onBlur() {
        //console.log(this.props.navigation.dangerouslyGetState());
        //(this.props.dispatch as MyThunkDispatch)(disconnectFromChat());
    }

    componentDidUpdate() {
        if (this.props.rooms.length < ROOMS_FETCH_LIMIT) this.fetchMore();
    }

    render(): JSX.Element {
        const {theme, rooms, fetchingRooms, dispatch} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.wrapper}>
                <KeyboardAvoidingView style={{flex: 1, width: "100%"}}>
                    <ScrollView
                        style={styles.matchesContainer}
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
                        {rooms.map((cr: ChatRoom) => (
                            <ChatRoomCard key={cr.id} room={cr} />
                        ))}
                        {!fetchingRooms && rooms.length == 0 && (
                            <View style={styles.noMatchesContainer}>
                                <Text style={styles.noMatchesText}>{i18n.t("messaging.noMatches")}</Text>
                            </View>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            flex: 1,
            paddingHorizontal: 0,
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: theme.background,
            //height: 250,
        },
        matchesContainer: {
            width: "100%",
            height: "100%",
            paddingVertical: 20,
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
