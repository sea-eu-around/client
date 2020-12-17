import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {
    ActivityIndicator,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {Button, withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {UserProfile} from "../model/user-profile";
import {fetchProfiles, refreshFetchedProfiles} from "../state/matching/actions";
import store from "../state/store";
import {AppState, MyThunkDispatch} from "../state/types";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";
import {TabMatchingRoot} from "../navigation/types";
import {PROFILES_FETCH_LIMIT} from "../constants/config";
import ScreenWrapper from "./ScreenWrapper";
import {styleTextLight} from "../styles/general";
import {MaterialIcons} from "@expo/vector-icons";
import HistoryProfileCard from "../components/HistoryProfileCard";
import SearchableProfileList from "../components/SearchableProfileList";

const reduxConnector = connect((state: AppState) => ({
    profiles: state.matching.fetchedProfiles,
    fetchingProfiles: state.matching.profilesPagination.fetching,
    justRefreshed: state.matching.profilesPagination.page == 1,
}));

// Component props
type MatchHistoryScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<TabMatchingRoot, "MatchHistoryScreen">;

// Component state
type MatchHistoryScreenState = {
    hiddenIds: {[key: string]: boolean};
    filtersState: {[key: string]: boolean};
};

const SCROLL_DISTANCE_TO_LOAD = 50;

class MatchHistoryScreen extends React.Component<MatchHistoryScreenProps, MatchHistoryScreenState> {
    scrollViewRef: React.RefObject<ScrollView> = React.createRef<ScrollView>();

    constructor(props: MatchHistoryScreenProps) {
        super(props);
        this.state = {hiddenIds: {}, filtersState: {like: true, dislike: true, block: true}};
    }

    fetchMore() {
        const {fetchingProfiles, navigation, dispatch} = this.props;
        if (!fetchingProfiles && navigation.isFocused()) (dispatch as MyThunkDispatch)(fetchProfiles());
    }

    hideProfile(p: UserProfile) {
        this.setState({...this.state, hiddenIds: {...this.state.hiddenIds, [p.id]: true}});
    }

    componentDidMount() {
        const shownProfiles = this.props.profiles.length - Object.keys(this.state.hiddenIds).length;
        if (shownProfiles == 0) this.fetchMore();
    }

    componentDidUpdate(oldProps: MatchHistoryScreenProps) {
        if (this.props.navigation.isFocused()) {
            const shownProfiles = this.props.profiles.filter((p) => !this.state.hiddenIds[p.id]).length;
            if (shownProfiles < PROFILES_FETCH_LIMIT) this.fetchMore();
            // Reset the hidden profiles when the user purposedly refreshes
            if (!oldProps.justRefreshed && this.props.justRefreshed) this.setState({...this.state, hiddenIds: {}});
        }
    }

    render(): JSX.Element {
        const {profiles, theme, fetchingProfiles} = this.props;
        const {hiddenIds, filtersState} = this.state;
        const styles = themedStyles(theme);

        const filters = ["like", "dislike", "block"];

        return (
            <ScreenWrapper>
                <View style={styles.filtersContainer}>
                    {filters.map((key: string) => (
                        <Filter
                            theme={theme}
                            key={`match-history-filter-${key}`}
                            filterKey={key}
                            selected={filtersState[key]}
                            onPress={() =>
                                this.setState({
                                    ...this.state,
                                    filtersState: {...this.state.filtersState, [key]: !this.state.filtersState[key]},
                                })
                            }
                        />
                    ))}
                </View>
                <SearchableProfileList
                    profiles={profiles}
                    searchBarProps={{
                        containerStyle: styles.searchBarContainer,
                        inputContainerStyle: styles.searchBarInputContainer,
                        inputStyle: styles.searchBarInput,
                    }}
                >
                    {(searchedProfiles: UserProfile[]) => (
                        <ScrollView
                            ref={this.scrollViewRef}
                            style={styles.scroller}
                            refreshControl={
                                <RefreshControl
                                    refreshing={fetchingProfiles}
                                    onRefresh={() => store.dispatch(refreshFetchedProfiles())}
                                />
                            }
                            onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                                const {layoutMeasurement, contentOffset, contentSize} = e.nativeEvent;
                                const distanceToBottom =
                                    contentSize.height - contentOffset.y - layoutMeasurement.height;
                                if (distanceToBottom < SCROLL_DISTANCE_TO_LOAD) this.fetchMore();
                            }}
                        >
                            <View style={styles.matchContainer}>
                                {searchedProfiles
                                    .filter((p) => !hiddenIds[p.id])
                                    .map((profile: UserProfile) => (
                                        <HistoryProfileCard
                                            key={profile.id}
                                            profile={profile}
                                            onHidden={() => this.hideProfile(profile)}
                                        />
                                    ))}
                                <View style={styles.loadingIndicatorContainer}>
                                    {fetchingProfiles && profiles.length > 0 && (
                                        <ActivityIndicator size="large" color={theme.accentSecondary} />
                                    )}
                                </View>
                                {!fetchingProfiles && searchedProfiles.length == 0 && (
                                    <View style={styles.noResultsContainer}>
                                        <Text style={styles.noResultsText1}>{i18n.t("matching.noResults")}</Text>
                                        <Text style={styles.noResultsText2}>{i18n.t("matching.noResultsAdvice")}</Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    )}
                </SearchableProfileList>
            </ScreenWrapper>
        );
    }
}

function Filter({
    theme,
    selected,
    filterKey,
    onPress,
}: {
    theme: Theme;
    selected: boolean;
    filterKey: string;
    onPress: () => void;
}): JSX.Element {
    const styles = themedStyles(theme);
    return (
        <Button
            onPress={onPress}
            title={i18n.t(`matching.history.filters.${filterKey}`)}
            containerStyle={styles.filterButtonContainer}
            buttonStyle={[styles.filterButton, selected ? styles.filterButtonSelected : {}]}
            titleStyle={[styles.filterLabel, selected ? styles.filterLabelSelected : {}]}
            icon={
                <MaterialIcons
                    name={selected ? "check" : "close"}
                    style={[styles.filterIcon, selected ? styles.filterIconSelected : {}]}
                />
            }
            raised={true}
        />
    );
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        topBar: {
            flexBasis: 90,
            paddingTop: 40,
            paddingHorizontal: 20,
            width: "100%",
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
        },
        separator: {
            marginVertical: 20,
            height: 1,
            width: "100%",
        },
        scroller: {
            width: "100%",
        },
        matchContainer: {
            flex: 1,
            borderStyle: "solid",
            borderColor: "red",
            borderWidth: 0,
        },
        loadingIndicatorContainer: {
            marginVertical: 10,
            height: 50,
        },
        filtersIcon: {
            paddingHorizontal: 5,
            fontSize: 26,
            color: theme.textLight,
        },
        headerContainer: {
            flexDirection: "row",
            paddingRight: 10,
        },
        noResultsContainer: {
            flex: 1,
            alignItems: "center",
        },
        noResultsText1: {
            fontSize: 20,
            letterSpacing: 0.75,
            color: theme.text,
            marginVertical: 5,
        },
        noResultsText2: {
            fontSize: 16,
            letterSpacing: 0.5,
            color: theme.text,
        },
        filtersContainer: {
            width: "100%",
            marginVertical: 10,
            flexDirection: "row",
        },
        filterButtonContainer: {
            flex: 1,
            marginHorizontal: 15,
        },
        filterButton: {
            height: 40,
            backgroundColor: theme.cardBackground,
        },
        filterButtonSelected: {
            backgroundColor: theme.accent,
        },
        filterLabel: {
            color: theme.text,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            ...styleTextLight,
        },
        filterLabelSelected: {
            color: theme.textWhite,
            fontWeight: "bold",
        },
        filterIcon: {
            fontSize: 18,
            color: theme.text,
            marginRight: 4,
        },
        filterIconSelected: {
            color: theme.textWhite,
        },
        // Search bar
        searchBarContainer: {
            width: "100%",
            marginBottom: 5,
            paddingHorizontal: 15,
        },
        searchBarInputContainer: {
            height: 40,
            backgroundColor: theme.cardBackground,
            elevation: 2,
        },
        searchBarInput: {
            fontSize: 14,
        },
    });
});

export default reduxConnector(withTheme(MatchHistoryScreen));
