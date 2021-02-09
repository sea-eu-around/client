import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {connect, ConnectedProps} from "react-redux";
import {AppState, MyThunkDispatch} from "../state/types";
import InfiniteScroller from "./InfiniteScroller";
import {fetchGroups} from "../state/groups/actions";
import {GROUPS_FETCH_LIMIT} from "../constants/config";
import {Group} from "../model/groups";
import {NavigationProp} from "@react-navigation/native";
import MyGroupCard from "./cards/MyGroupCard";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    groups: state.groups.myGroups,
    groupsDict: state.groups.groupsDict,
    pagination: state.groups.pagination,
}));

// Component props
export type GroupInvitesViewProps = ThemeProps &
    ConnectedProps<typeof reduxConnector> & {navigation: NavigationProp<never>};

class GroupInvitesView extends React.Component<GroupInvitesViewProps> {
    render() {
        const {theme, groups, groupsDict, pagination, navigation, dispatch} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.container}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{i18n.t("groups.invites")}</Text>
                </View>
                <InfiniteScroller
                    //ref={this.scrollerRef}
                    navigation={navigation}
                    fetchLimit={GROUPS_FETCH_LIMIT}
                    fetchMore={() => (dispatch as MyThunkDispatch)(fetchGroups())}
                    fetching={pagination.fetching}
                    canFetchMore={pagination.canFetchMore}
                    // refreshOnFocus={true}
                    currentPage={pagination.page}
                    items={groups.map((id) => groupsDict[id])}
                    id={(group: Group): string => group.id}
                    horizontal
                    hideScrollIndicator
                    noResultsComponent={
                        <>
                            <Text style={styles.noResultsText1}>{i18n.t("matching.noResults")}</Text>
                            <Text style={styles.noResultsText2}>{i18n.t("matching.noItemsAdvice")}</Text>
                        </>
                    }
                    refresh={() => /*dispatch(refreshFetchedProfiles())*/ console.log("refresh")}
                    renderItem={(group: Group) => <MyGroupCard key={group.id} group={group} />}
                    // Compensate for the header
                    //itemsContainerStyle={styles.itemsContainer}
                    progressViewOffset={100}
                />
            </View>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "95%",
            marginVertical: 15,
            paddingHorizontal: 15,
            paddingTop: 10,
            paddingBottom: 20,
            backgroundColor: theme.cardBackground,
            borderRadius: 20,
        },
        titleWrapper: {
            width: "100%",
            //justifyContent: "flex-start",
            marginBottom: 20,
        },
        title: {
            fontSize: 22,
            color: theme.text,
        },

        rootScroll: {
            width: "100%",
        },
        scrollContent: {
            width: "100%",
            alignItems: "center",
        },
        noResultsText1: {},
        noResultsText2: {},
    });
});

export default reduxConnector(withTheme(GroupInvitesView));
