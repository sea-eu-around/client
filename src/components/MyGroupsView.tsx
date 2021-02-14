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
    myGroups: state.groups.myGroups,
    groupsDict: state.groups.groupsDict,
    pagination: state.groups.myGroupsPagination,
}));

// Component props
export type MyGroupsViewProps = ThemeProps &
    ConnectedProps<typeof reduxConnector> & {navigation: NavigationProp<never>};

class MyGroupsView extends React.Component<MyGroupsViewProps> {
    render() {
        const {theme, myGroups, groupsDict, pagination, navigation, dispatch} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.container}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{i18n.t("groups.myGroups.title")}</Text>
                </View>
                <InfiniteScroller
                    navigation={navigation}
                    fetchLimit={GROUPS_FETCH_LIMIT}
                    fetchMore={() => (dispatch as MyThunkDispatch)(fetchMyGroups())}
                    fetching={pagination.fetching}
                    canFetchMore={pagination.canFetchMore}
                    currentPage={pagination.page}
                    items={myGroups.map((id) => groupsDict[id])}
                    id={(group: Group): string => group.id}
                    horizontal
                    hideScrollIndicator
                    refreshOnFocus
                    noResultsComponent={<Text style={styles.noResultsText}>{i18n.t("groups.myGroups.none")}</Text>}
                    refresh={() => dispatch(refreshFetchedMyGroups())}
                    renderItem={(group: Group) => <MyGroupCard key={group.id} group={group} />}
                    // Compensate for the header
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
        },
    });
});

export default reduxConnector(withTheme(MyGroupsView));
