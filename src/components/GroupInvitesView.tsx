import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {connect, ConnectedProps} from "react-redux";
import {AppState, MyThunkDispatch} from "../state/types";
import InfiniteScroller from "./InfiniteScroller";
import {fetchMyGroups, refreshFetchedMyGroups} from "../state/groups/actions";
import {GROUPS_FETCH_LIMIT} from "../constants/config";
import {Group} from "../model/groups";
import {NavigationProp} from "@react-navigation/native";
import MyGroupCard from "./cards/MyGroupCard";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    invites: state.groups.myGroupInvites,
    groupsDict: state.groups.groupsDict,
    pagination: state.groups.myGroupInvitesPagination,
}));

// Component props
export type GroupInvitesViewProps = ThemeProps &
    ConnectedProps<typeof reduxConnector> & {navigation: NavigationProp<never>};

class GroupInvitesView extends React.Component<GroupInvitesViewProps> {
    render() {
        const {theme, invites, groupsDict, pagination, navigation, dispatch} = this.props;
        const styles = themedStyles(theme);

        const hasInvites = invites.length > 0;

        if (!hasInvites) return <></>;

        return (
            <View style={styles.container}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{i18n.t("groups.invites")}</Text>
                </View>
                <InfiniteScroller
                    navigation={navigation}
                    fetchLimit={GROUPS_FETCH_LIMIT}
                    fetchMore={() => (dispatch as MyThunkDispatch)(fetchMyGroups(true))}
                    fetching={pagination.fetching}
                    canFetchMore={pagination.canFetchMore}
                    currentPage={pagination.page}
                    items={invites.map((id) => groupsDict[id])}
                    id={(group: Group): string => group.id}
                    horizontal
                    hideScrollIndicator
                    refreshOnFocus
                    noResultsComponent={<></>}
                    refresh={() => dispatch(refreshFetchedMyGroups(true))}
                    renderItem={(group: Group) => <MyGroupCard key={group.id} group={group} isInvite />}
                    itemsContainerStyle={styles.itemsContainer}
                />
            </View>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            paddingTop: 10,
            paddingBottom: 20,
            backgroundColor: theme.cardBackground,
            marginVertical: 20,
        },
        titleWrapper: {
            width: "100%",
            marginBottom: 20,
            paddingHorizontal: 15,
        },
        title: {
            fontSize: 22,
            color: theme.text,
        },
        itemsContainer: {paddingHorizontal: 15},

        noResultsText: {
            fontSize: 16,
            maxWidth: 200,
            textAlign: "center",
            color: theme.textLight,
        },
    });
});

export default reduxConnector(withTheme(GroupInvitesView));
