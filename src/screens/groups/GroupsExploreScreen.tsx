import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, Text} from "react-native";
import {withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {AppState, MyThunkDispatch} from "../../state/types";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import i18n from "i18n-js";
import {TabGroupsRoot} from "../../navigation/types";
import {GROUPS_FETCH_LIMIT, SEARCH_BUFFER_DELAY} from "../../constants/config";
import ScreenWrapper from "../ScreenWrapper";
import InfiniteScroller from "../../components/InfiniteScroller";
import BufferedSearchBar from "../../components/BufferedSearchBar";
import {fetchGroups, refreshFetchedGroups} from "../../state/groups/actions";
import {Group} from "../../model/groups";
import GroupExploreCard from "../../components/cards/GroupExploreCard";
import {GroupMemberStatus} from "../../api/dto";

const reduxConnector = connect((state: AppState) => ({
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
        const {theme, groups, groupsDict, pagination, navigation} = this.props;
        const {search} = this.state;
        const styles = themedStyles(theme);
        const dispatch = this.props.dispatch as MyThunkDispatch;

        return (
            <ScreenWrapper>
                <BufferedSearchBar
                    onBufferedUpdate={() => dispatch(refreshFetchedGroups())}
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
                    fetchMore={() => dispatch(fetchGroups(search))}
                    fetching={pagination.fetching}
                    canFetchMore={pagination.canFetchMore}
                    currentPage={pagination.page}
                    items={groups.map((id) => groupsDict[id])}
                    id={(group: Group): string => group.id}
                    hideScrollIndicator
                    noResultsComponent={<Text style={styles.noResultsText}>{i18n.t("groups.explore.none")}</Text>}
                    refresh={() => dispatch(refreshFetchedGroups())}
                    refreshOnFocus
                    renderItem={(group: Group) =>
                        group.myStatus === GroupMemberStatus.Approved ? (
                            <></>
                        ) : (
                            <GroupExploreCard key={group.id} group={group} />
                        )
                    }
                    itemsContainerStyle={styles.itemsContainer}
                />
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        itemsContainer: {
            width: "100%",
            maxWidth: 600,
            alignSelf: "center",
            alignItems: "center",
        },
        noResultsText: {
            fontSize: 20,
            color: theme.textLight,
            marginVertical: 10,
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
