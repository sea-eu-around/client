import * as React from "react";
import {StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {Group, GroupPost, PostSortingOrder} from "../model/groups";
import {MaterialIcons} from "@expo/vector-icons";
import EditPostModal from "./modals/EditPostModal";
import InfiniteScroller from "./InfiniteScroller";
import {NavigationProp} from "@react-navigation/native";
import {GROUPS_POSTS_FETCH_LIMIT} from "../constants/config";
import {AppState, MyThunkDispatch, PaginatedState} from "../state/types";
import {fetchGroupPosts, refreshFetchedGroupPosts, setPostSortingOrder} from "../state/groups/actions";
import GroupPostCard from "./cards/GroupPostCard";
import PostSortingOrderPicker from "./PostSortingOrderPicker";
import {connect, ConnectedProps} from "react-redux";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    sortOrder: state.groups.postsSortOrder,
}));

// Component props
export type GroupPostsViewProps = ThemeProps &
    ConnectedProps<typeof reduxConnector> & {
        group: Group | null;
        titleContainerStyle?: StyleProp<ViewStyle>;
        navigation: NavigationProp<never>;
        top?: JSX.Element;
    };

class GroupPostsView extends React.Component<GroupPostsViewProps> {
    render() {
        const {group, top, navigation, titleContainerStyle, sortOrder, dispatch, theme} = this.props;
        const styles = themedStyles(theme);

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
                                    <EditPostModal
                                        group={group}
                                        activator={(show) => (
                                            <TouchableOpacity style={styles.button} onPress={show}>
                                                <MaterialIcons style={styles.buttonIcon} name="add" />
                                            </TouchableOpacity>
                                        )}
                                    />
                                )}
                                <PostSortingOrderPicker
                                    order={sortOrder}
                                    activator={(show) => (
                                        <TouchableOpacity style={styles.button} onPress={show}>
                                            <MaterialIcons style={styles.buttonIcon} name="sort" />
                                        </TouchableOpacity>
                                    )}
                                    onChange={(order: PostSortingOrder) => {
                                        dispatch(setPostSortingOrder(order));
                                        if (group) dispatch(refreshFetchedGroupPosts(group.id));
                                    }}
                                />
                            </View>
                        </View>
                    </>
                }
                navigation={navigation}
                fetchLimit={GROUPS_POSTS_FETCH_LIMIT}
                fetchMore={() => {
                    if (group) (dispatch as MyThunkDispatch)(fetchGroupPosts(group.id));
                }}
                fetching={pagination.fetching}
                canFetchMore={pagination.canFetchMore}
                // refreshOnFocus
                currentPage={pagination.page}
                items={group ? group.postIds.map((id) => group.posts[id]) : []}
                id={(post: GroupPost): string => post.id}
                hideScrollIndicator
                endOfItemsComponent={<Text style={styles.noResultsText}>{i18n.t("groups.noMorePosts")}</Text>}
                noResultsComponent={<Text style={styles.noResultsText}>{i18n.t("groups.noPosts")}</Text>}
                refresh={() => {
                    if (group) dispatch(refreshFetchedGroupPosts(group.id));
                }}
                renderItem={(post: GroupPost) => <GroupPostCard key={post.id} group={group} post={post} />}
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
            //backgroundColor: theme.accentSlight,
        },
        titleWrapper: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
            //backgroundColor: theme.accentSlight,
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
        noResultsText: {
            color: theme.text,
            fontSize: 16,
        },
    });
});

export default reduxConnector(withTheme(GroupPostsView));
