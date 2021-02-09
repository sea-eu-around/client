import * as React from "react";
import {StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {Group, GroupPost} from "../model/groups";
import {MaterialIcons} from "@expo/vector-icons";
import CreatePostModal from "./modals/CreatePostModal";
import InfiniteScroller from "./InfiniteScroller";
import {NavigationProp} from "@react-navigation/native";
import {GROUPS_POSTS_FETCH_LIMIT} from "../constants/config";
import {MyThunkDispatch, PaginatedState} from "../state/types";
import {fetchGroupPosts, refreshFetchedGroupPosts} from "../state/groups/actions";
import store from "../state/store";
import GroupPostCard from "./cards/GroupPostCard";

// Component props
export type GroupPostsViewProps = ThemeProps & {
    group: Group | null;
    titleContainerStyle?: StyleProp<ViewStyle>;
    navigation: NavigationProp<never>;
    top?: JSX.Element;
};

class GroupPostsView extends React.Component<GroupPostsViewProps> {
    render() {
        const {theme, group, top, navigation, titleContainerStyle} = this.props;
        const styles = themedStyles(theme);
        console.log("group", group);
        console.log(group && group.postIds.map((id) => group.posts[id]));

        const pagination: PaginatedState = group
            ? group.postsPagination
            : {canFetchMore: true, fetching: true, page: 1};

        return (
            <InfiniteScroller
                top={
                    <>
                        {top}
                        <View style={[styles.titleWrapper, titleContainerStyle]}>
                            <Text style={styles.title}>{i18n.t("groups.posts")}</Text>
                            <View style={styles.buttons}>
                                {group && (
                                    <CreatePostModal
                                        group={group}
                                        activator={(show) => (
                                            <TouchableOpacity style={styles.button} onPress={show}>
                                                <MaterialIcons style={styles.buttonIcon} name="add" />
                                            </TouchableOpacity>
                                        )}
                                    />
                                )}
                                <TouchableOpacity style={styles.button}>
                                    <MaterialIcons style={styles.buttonIcon} name="sort" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                }
                navigation={navigation}
                fetchLimit={GROUPS_POSTS_FETCH_LIMIT}
                fetchMore={() => {
                    if (group) (store.dispatch as MyThunkDispatch)(fetchGroupPosts(group.id));
                }}
                fetching={pagination.fetching}
                canFetchMore={pagination.canFetchMore}
                // refreshOnFocus
                currentPage={pagination.page}
                items={group ? group.postIds.map((id) => group.posts[id]) : []}
                id={(post: GroupPost): string => post.id}
                hideScrollIndicator
                noResultsComponent={
                    <>
                        <Text style={styles.noResultsText1}>{i18n.t("matching.noResults")}</Text>
                        <Text style={styles.noResultsText2}>{i18n.t("matching.noItemsAdvice")}</Text>
                    </>
                }
                refresh={() => {
                    if (group) store.dispatch(refreshFetchedGroupPosts(group.id));
                }}
                renderItem={(post: GroupPost) => <GroupPostCard key={post.id} post={post} />}
                // Compensate for the header
                itemsContainerStyle={styles.itemsContainer}
                progressViewOffset={350}
            />
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        itemsContainer: {
            backgroundColor: theme.accentSlight,
        },
        titleWrapper: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: theme.accentSlight,
        },
        title: {
            fontSize: 20,
        },
        buttons: {
            flexDirection: "row",
        },
        button: {
            width: 32,
            height: 32,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 4,
        },
        buttonIcon: {
            fontSize: 24,
            color: theme.text,
        },
        noResultsText1: {},
        noResultsText2: {},
    });
});

export default withTheme(GroupPostsView);
