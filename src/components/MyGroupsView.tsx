import * as React from "react";
import {StyleSheet, Text} from "react-native";
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

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    groups: state.groups.myGroups,
    pagination: state.groups.pagination,
}));

// Component props
export type MyGroupsViewProps = ThemeProps &
    ConnectedProps<typeof reduxConnector> & {navigation: NavigationProp<never>};

class MyGroupsView extends React.Component<MyGroupsViewProps> {
    render() {
        const {theme, groups, pagination, navigation, dispatch} = this.props;
        const styles = themedStyles(theme);

        /*return (
            <ScrollView style={styles.rootScroll} contentContainerStyle={styles.scrollContent} overScrollMode="never">
                
            </ScrollView>
        );*/
        return (
            <InfiniteScroller
                //ref={this.scrollerRef}
                navigation={navigation}
                fetchLimit={GROUPS_FETCH_LIMIT}
                fetchMore={() => (dispatch as MyThunkDispatch)(fetchGroups())}
                fetching={pagination.fetching}
                canFetchMore={pagination.canFetchMore}
                // refreshOnFocus={true}
                currentPage={pagination.page}
                items={groups}
                id={(group: Group): string => group.name}
                noResultsComponent={
                    <>
                        <Text style={styles.noResultsText1}>{i18n.t("matching.noResults")}</Text>
                        <Text style={styles.noResultsText2}>{i18n.t("matching.noItemsAdvice")}</Text>
                    </>
                }
                refresh={() => /*dispatch(refreshFetchedProfiles())*/ console.log("refresh")}
                renderItem={(group: Group) => <Text>{group.name}</Text>}
                // Compensate for the header
                //itemsContainerStyle={styles.itemsContainer}
                progressViewOffset={100}
            />
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        rootScroll: {
            width: "100%",
        },
        scrollContent: {
            width: "100%",
            alignItems: "center",
        },

        titleWrapper: {
            width: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            marginBottom: 20,
        },
        title: {
            fontSize: 22,
            color: theme.text,
        },
        noResultsText1: {},
        noResultsText2: {},
    });
});

export default reduxConnector(withTheme(MyGroupsView));
