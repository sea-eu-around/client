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
import Button from "./Button";
import {MaterialIcons} from "@expo/vector-icons";
import {rootNavigate} from "../navigation/utils";

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
                    <Button
                        text={i18n.t("groups.explore.button")}
                        icon={<MaterialIcons name="explore" style={styles.exploreIcon} />}
                        iconLeft
                        style={styles.exploreButton}
                        textStyle={styles.exploreButtonText}
                        onPress={() =>
                            rootNavigate("MainScreen", {screen: "TabGroups", params: {screen: "GroupsExploreScreen"}})
                        }
                    />
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
                    noResultsComponent={<Text style={styles.noResultsText}>{i18n.t("groups.myGroups.none")}</Text>}
                    refresh={() => dispatch(refreshFetchedMyGroups())}
                    renderItem={(group: Group) => <MyGroupCard key={group.id} group={group} />}
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
            flexDirection: "row",
            justifyContent: "space-between",
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

        exploreButton: {
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 100,
            backgroundColor: theme.background,
            justifyContent: "center",
        },
        exploreButtonText: {
            fontSize: 14,
            color: theme.text,
        },
        exploreIcon: {
            fontSize: 24,
            color: theme.textLight,
            marginRight: 4,
        },
    });
});

export default reduxConnector(withTheme(MyGroupsView));
