import * as React from "react";
import {StyleSheet, Text} from "react-native";
import {withTheme} from "react-native-elements";
import {MyThunkDispatch, PaginatedState} from "../state/types";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";
import {GROUP_MEMBERS_FETCH_LIMIT, SEARCH_BUFFER_DELAY} from "../constants/config";
import InfiniteScroller from "../components/InfiniteScroller";
import BufferedSearchBar from "../components/BufferedSearchBar";
import {fetchGroupMembers, fetchGroupMembersRefresh} from "../state/groups/actions";
import {Group, GroupMember} from "../model/groups";
import {GroupMemberStatus} from "../api/dto";
import {NavigationProp} from "@react-navigation/native";
import store from "../state/store";

// Component props
type GroupMembersViewProps = {
    group: Group | null;
    status: GroupMemberStatus;
    navigation: NavigationProp<never>;
    renderItem: (member: GroupMember) => JSX.Element;
    noResultsText?: string;
} & ThemeProps;

// Component state
type GroupMembersViewState = {
    search: string;
};

class GroupMembersView extends React.Component<GroupMembersViewProps, GroupMembersViewState> {
    constructor(props: GroupMembersViewProps) {
        super(props);
        this.state = {search: ""};
    }

    render(): JSX.Element {
        const {theme, group, status, renderItem, noResultsText, navigation} = this.props;
        const {search} = this.state;
        const styles = themedStyles(theme);

        const dispatch = store.dispatch as MyThunkDispatch;

        const pagination: PaginatedState = group
            ? group.membersPaginations[status]
            : {canFetchMore: true, fetching: true, page: 1};
        const memberIds = group ? group.memberIds[status] : [];
        const members = group ? memberIds.map((id) => group.members[id]) : [];

        const numApproved = group?.numApprovedMembers;

        return (
            <>
                {numApproved !== null && numApproved !== undefined && numApproved > 0 && (
                    <BufferedSearchBar
                        onBufferedUpdate={() => group && dispatch(fetchGroupMembersRefresh(group.id, status))}
                        bufferDelay={SEARCH_BUFFER_DELAY}
                        placeholder={i18n.t("search")}
                        onChangeText={(search: string) => this.setState({...this.state, search})}
                        value={search}
                        containerStyle={styles.searchBarContainer}
                        inputContainerStyle={styles.searchBarInputContainer}
                        inputStyle={styles.searchBarInput}
                    />
                )}
                <InfiniteScroller
                    navigation={navigation}
                    fetchLimit={GROUP_MEMBERS_FETCH_LIMIT}
                    fetchMore={() => group && dispatch(fetchGroupMembers(group.id, status, search))}
                    fetching={pagination.fetching}
                    canFetchMore={pagination.canFetchMore}
                    currentPage={pagination.page}
                    items={members}
                    id={(member: GroupMember): string => member.profile.id}
                    hideScrollIndicator
                    noResultsComponent={<Text style={styles.noResultsText}>{noResultsText}</Text>}
                    refresh={() => group && dispatch(fetchGroupMembersRefresh(group.id, status))}
                    refreshOnFocus
                    renderItem={(member: GroupMember) => renderItem(member)}
                    itemsContainerStyle={styles.itemsContainer}
                />
            </>
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
        noResultsText: {
            fontSize: 18,
            color: theme.textLight,
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

export default withTheme(GroupMembersView);
