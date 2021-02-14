import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, Text} from "react-native";
import {Button, withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {refreshFetchedHistory} from "../../state/matching/actions";
import {AppState, MyThunkDispatch} from "../../state/types";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import i18n from "i18n-js";
import {TabGroupsRoot} from "../../navigation/types";
import {GROUPS_FETCH_LIMIT, SEARCH_BUFFER_DELAY} from "../../constants/config";
import ScreenWrapper from "../ScreenWrapper";
import InfiniteScroller from "../../components/InfiniteScroller";
import {MATCH_ACTION_HISTORY_STATUSES} from "../../api/dto";
import BufferedSearchBar from "../../components/BufferedSearchBar";
import {fetchGroups, refreshFetchedGroups} from "../../state/groups/actions";
import {Group} from "../../model/groups";
import GroupExploreCard from "../../components/cards/GroupExploreCard";

const reduxConnector = connect((state: AppState) => ({
    historyFilters: state.matching.historyFilters,
    pagination: state.groups.pagination,
    groups: state.groups.groups,
    groupsDict: state.groups.groupsDict,
}));

// Component props
type GroupsExploreScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<TabGroupsRoot, "GroupsExploreScreen">;

// Component state
type GroupsExploreScreenState = {
    search: string;
};

class GroupsExploreScreen extends React.Component<GroupsExploreScreenProps, GroupsExploreScreenState> {
    constructor(props: GroupsExploreScreenProps) {
        super(props);
        this.state = {search: ""};
    }

    render(): JSX.Element {
        const {theme, groups, groupsDict, pagination, navigation, dispatch} = this.props;
        const {search} = this.state;
        const styles = themedStyles(theme);

        const filters = MATCH_ACTION_HISTORY_STATUSES;

        return (
            <ScreenWrapper>
                {/*<View style={styles.filtersContainer}>
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
                        </View>*/}
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
                    fetchLimit={GROUPS_FETCH_LIMIT}
                    fetchMore={() => (dispatch as MyThunkDispatch)(fetchGroups(search))}
                    fetching={pagination.fetching}
                    canFetchMore={pagination.canFetchMore}
                    currentPage={pagination.page}
                    items={groups.map((id) => groupsDict[id])}
                    id={(group: Group): string => group.id}
                    hideScrollIndicator
                    noResultsComponent={<Text style={styles.noResultsText}>{i18n.t("groups.explore.none")}</Text>}
                    refresh={() => dispatch(refreshFetchedGroups())}
                    refreshOnFocus
                    renderItem={(group: Group) => <GroupExploreCard key={group.id} group={group} />}
                    itemsContainerStyle={styles.itemsContainer}
                    // Compensate for the header
                    progressViewOffset={100}
                />
            </ScreenWrapper>
        );
    }
}

// TODO remove
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
        itemsContainer: {
            width: "100%",
            maxWidth: 600,
            alignSelf: "center",
            alignItems: "center",
            paddingHorizontal: 20,
        },
        noResultsText: {
            fontSize: 20,
            color: theme.textLight,
            marginVertical: 10,
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

export default reduxConnector(withTheme(GroupsExploreScreen));
