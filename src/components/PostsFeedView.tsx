import * as React from "react";
import {StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {GroupPost} from "../model/groups";
import InfiniteScroller from "./InfiniteScroller";
import {NavigationProp} from "@react-navigation/native";
import {GROUPS_POSTS_FETCH_LIMIT} from "../constants/config";
import {AppState, MyThunkDispatch} from "../state/types";
import {fetchPostsFeed, refreshFetchedPostsFeed} from "../state/groups/actions";
import {connect, ConnectedProps} from "react-redux";
import GroupPostCard from "./cards/GroupPostCard";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    pagination: state.groups.feedPagination,
    postIds: state.groups.postsFeedIds,
    posts: state.groups.postsFeed,
}));

// TODO clean-up
// Component props
export type GroupPostsViewProps = ThemeProps &
    ConnectedProps<typeof reduxConnector> & {
        titleContainerStyle?: StyleProp<ViewStyle>;
        navigation: NavigationProp<never>;
        top?: JSX.Element;
    };

class GroupPostsView extends React.Component<GroupPostsViewProps> {
    render() {
        const {pagination, postIds, posts, top, navigation, titleContainerStyle, dispatch, theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <InfiniteScroller
                top={
                    <>
                        {top}
                        <View style={[styles.titleWrapper, titleContainerStyle]}>
                            <Text style={styles.title}>{i18n.t("groups.posts")}</Text>
                            {/*<View style={styles.buttons}>
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
                            </View>*/}
                        </View>
                    </>
                }
                navigation={navigation}
                fetchLimit={GROUPS_POSTS_FETCH_LIMIT}
                fetchMore={() => (dispatch as MyThunkDispatch)(fetchPostsFeed())}
                fetching={pagination.fetching}
                canFetchMore={pagination.canFetchMore}
                currentPage={pagination.page}
                refreshOnFocus
                items={postIds.map((id) => posts[id])}
                id={(post: GroupPost): string => post.id}
                hideScrollIndicator
                endOfItemsComponent={<Text style={styles.noResultsText}>{i18n.t("groups.noMorePosts")}</Text>}
                noResultsComponent={<Text style={styles.noResultsText}>{i18n.t("groups.noPosts")}</Text>}
                refresh={() => dispatch(refreshFetchedPostsFeed())}
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
