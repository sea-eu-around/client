import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Button, withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {fetchHistory, refreshFetchedHistory, setHistoryFilters} from "../state/matching/actions";
import {AppState, MyThunkDispatch} from "../state/types";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";
import {TabMatchingRoot} from "../navigation/types";
import {HISTORY_FETCH_LIMIT, SEARCH_BUFFER_DELAY} from "../constants/config";
import ScreenWrapper from "./ScreenWrapper";
import HistoryProfileCard from "../components/cards/HistoryProfileCard";
import InfiniteScroller from "../components/InfiniteScroller";
import {MATCH_ACTION_HISTORY_STATUSES} from "../api/dto";
import {MatchHistoryItem} from "../model/matching";
import BufferedSearchBar from "../components/BufferedSearchBar";

const reduxConnector = connect((state: AppState) => ({
    historyItems: state.matching.historyItems,
    fetchingHistory: state.matching.historyPagination.fetching,
    canFetchMore: state.matching.historyPagination.canFetchMore,
    currentPage: state.matching.historyPagination.page,
    historyFilters: state.matching.historyFilters,
}));

// Component props
type MatchHistoryScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<TabMatchingRoot, "MatchHistoryScreen">;

// Component state
type MatchHistoryScreenState = {
    search: string;
};

class MatchHistoryScreen extends React.Component<MatchHistoryScreenProps, MatchHistoryScreenState> {
    constructor(props: MatchHistoryScreenProps) {
        super(props);
        this.state = {search: ""};
    }

    render(): JSX.Element {
        const {
            historyItems,
            theme,
            historyFilters,
            fetchingHistory,
            canFetchMore,
            currentPage,
            navigation,
            dispatch,
        } = this.props;
        const {search} = this.state;
        const styles = themedStyles(theme);

        const filters = MATCH_ACTION_HISTORY_STATUSES;

        return (
            <ScreenWrapper>
                <View style={styles.filtersContainer}>
                    {filters.map((key: string) => (
                        <Filter
                            theme={theme}
                            key={`match-history-filter-${key}`}
                            filterKey={key}
                            selected={historyFilters[key]}
                            onPress={() => {
                                dispatch(setHistoryFilters({[key]: !historyFilters[key]}));
                                dispatch(refreshFetchedHistory());
                            }}
                        />
                    ))}
                </View>
                <BufferedSearchBar
                    onBufferedUpdate={() => dispatch(refreshFetchedHistory())}
                    bufferDelay={SEARCH_BUFFER_DELAY}
                    placeholder={i18n.t("search")}
                    onChangeText={(search: string) => this.setState({...this.state, search})}
                    value={search}
                    containerStyle={styles.searchBarContainer}
                    inputContainerStyle={styles.searchBarInputContainer}
                    inputStyle={styles.searchBarInput}
                />
                <InfiniteScroller
                    navigation={navigation}
                    fetchLimit={HISTORY_FETCH_LIMIT}
                    fetchMore={() => (dispatch as MyThunkDispatch)(fetchHistory(search))}
                    fetching={fetchingHistory}
                    canFetchMore={canFetchMore}
                    currentPage={currentPage}
                    items={historyItems}
                    id={(it: MatchHistoryItem): string => it.id}
                    noResultsComponent={
                        <>
                            <Text style={styles.noResultsText1}>{i18n.t("matching.history.noResults")}</Text>
                            <Text style={styles.noResultsText2}>{i18n.t("matching.history.noResultsAdvice")}</Text>
                        </>
                    }
                    refresh={() => dispatch(refreshFetchedHistory())}
                    refreshOnFocus
                    renderItem={(item: MatchHistoryItem, hide: () => void) => (
                        <HistoryProfileCard
                            key={`history-card-${item.id}-${item.status}`}
                            item={item}
                            onHidden={hide}
                            showSwipeTip={item.id === historyItems[0].id}
                        />
                    )}
                    itemsContainerStyle={styles.itemsContainer}
                />
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
            title={i18n.t(`matching.history.status.${filterKey}`)}
            containerStyle={styles.filterButtonContainer}
            buttonStyle={[styles.filterButton, selected ? styles.filterButtonSelected : {}]}
            titleStyle={[styles.filterLabel, selected ? styles.filterLabelSelected : {}]}
            raised={false}
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
        itemsContainer: {
            width: "100%",
            maxWidth: 600,
            alignSelf: "center",
        },
        headerContainer: {
            flexDirection: "row",
            paddingRight: 10,
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
        // Filters
        filtersContainer: {
            width: "100%",
            marginVertical: 10,
            flexDirection: "row",
        },
        filterButtonContainer: {
            flex: 1,
            marginHorizontal: 15,
            borderRadius: 25,
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
        },
        filterLabelSelected: {
            color: theme.textWhite,
            fontWeight: "600",
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
            paddingVertical: 0,
            paddingHorizontal: 15,
            backgroundColor: "transparent",
            borderTopWidth: 0,
            borderBottomWidth: 0,
        },
        searchBarInputContainer: {
            height: 40,
            backgroundColor: theme.cardBackground,
            elevation: 2,
            borderRadius: 25,
        },
        searchBarInput: {
            fontSize: 14,
        },
    });
});

export default reduxConnector(withTheme(MatchHistoryScreen));
