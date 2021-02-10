import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, Text} from "react-native";
import {withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {refreshFetchedHistory} from "../../state/matching/actions";
import {AppState, MyThunkDispatch, PaginatedState} from "../../state/types";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import i18n from "i18n-js";
import {TabGroupsRoot} from "../../navigation/types";
import {GROUPS_FETCH_LIMIT, SEARCH_BUFFER_DELAY} from "../../constants/config";
import ScreenWrapper from "../ScreenWrapper";
import InfiniteScroller from "../../components/InfiniteScroller";
import BufferedSearchBar from "../../components/BufferedSearchBar";
import {fetchGroupMembers} from "../../state/groups/actions";
import {Group, GroupMember} from "../../model/groups";
import {getRouteParams} from "../../navigation/utils";
import GroupMemberCard from "../../components/cards/GroupMemberCard";

const reduxConnector = connect((state: AppState) => ({
    groups: state.groups.groups,
    groupsDict: state.groups.groupsDict,
}));

// Component props
type GroupMembersScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<TabGroupsRoot, "GroupMembersScreen">;

// Component state
type GroupMembersScreenState = {
    search: string;
    groupId: string | null;
};

class GroupMembersScreen extends React.Component<GroupMembersScreenProps, GroupMembersScreenState> {
    constructor(props: GroupMembersScreenProps) {
        super(props);
        this.state = {search: "", groupId: null};
    }

    componentDidMount() {
        const {navigation, route} = this.props;

        navigation.addListener("focus", () => {
            const groupId = getRouteParams(route).groupId as string;
            this.setState({...this.state, groupId});
        });
    }

    private getGroup(): Group | null {
        const {groupsDict} = this.props;
        const {groupId} = this.state;
        return groupId ? groupsDict[groupId] || null : null;
    }

    render(): JSX.Element {
        const {theme, navigation, dispatch} = this.props;
        const {search} = this.state;
        const styles = themedStyles(theme);

        const group = this.getGroup();
        const pagination: PaginatedState = group
            ? group.membersPagination
            : {canFetchMore: true, fetching: true, page: 1};

        return (
            <ScreenWrapper>
                <BufferedSearchBar
                    onBufferedUpdate={() => dispatch(refreshFetchedHistory())} // TODO
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
                    fetchMore={() => group && (dispatch as MyThunkDispatch)(fetchGroupMembers(group.id))}
                    fetching={pagination.fetching}
                    canFetchMore={pagination.canFetchMore}
                    currentPage={pagination.page}
                    items={group && group.members ? group.members : []}
                    id={(member: GroupMember): string => member.profile.id}
                    hideScrollIndicator
                    noResultsComponent={
                        <>
                            <Text style={styles.noResultsText1}>{i18n.t("matching.noResults")}</Text>
                            <Text style={styles.noResultsText2}>{i18n.t("matching.noItemsAdvice")}</Text>
                        </>
                    }
                    refresh={() => /*dispatch(refreshFetchedProfiles())*/ console.log("refresh")}
                    refreshOnFocus
                    renderItem={(member: GroupMember) => (
                        <GroupMemberCard key={`${group?.id}-${member.profile.id}`} member={member} />
                    )}
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
            paddingHorizontal: 20,
            marginTop: 10,
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

export default reduxConnector(withTheme(GroupMembersScreen));
