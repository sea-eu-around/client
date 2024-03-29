import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {GroupPost} from "../model/groups";
import InfiniteScroller from "./InfiniteScroller";
import {NavigationProp} from "@react-navigation/native";
import {GROUPS_POSTS_FETCH_LIMIT} from "../constants/config";
import {AppState, MyThunkDispatch} from "../state/types";
import {fetchPostsFeed, refreshFetchedMyGroups, refreshFetchedPostsFeed} from "../state/groups/actions";
import {connect, ConnectedProps} from "react-redux";
import GroupPostCard from "./cards/GroupPostCard";
import CustomTooltip from "./CustomTooltip";
import {MaterialIcons} from "@expo/vector-icons";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    pagination: state.groups.feedPagination,
    postIds: state.groups.postsFeedIds,
    posts: state.groups.postsFeed,
}));

// Component props
export type PostsFeedViewProps = ThemeProps &
    ConnectedProps<typeof reduxConnector> & {
        navigation: NavigationProp<never>;
        top?: JSX.Element;
    };

class PostsFeedView extends React.Component<PostsFeedViewProps> {
    render() {
        const {pagination, postIds, posts, top, navigation, theme} = this.props;
        const styles = themedStyles(theme);
        const dispatch = this.props.dispatch as MyThunkDispatch;

        return (
            <InfiniteScroller
                top={
                    <>
                        {top}
                        <View style={styles.titleWrapper}>
                            <CustomTooltip text={i18n.t("groups.feed.help")}>
                                <MaterialIcons style={styles.feedTooltipIcon} name="help-outline" />
                            </CustomTooltip>
                            <Text style={styles.title}>{i18n.t("groups.feed.title")}</Text>
                        </View>
                    </>
                }
                navigation={navigation}
                fetchLimit={GROUPS_POSTS_FETCH_LIMIT}
                fetchMore={() => dispatch(fetchPostsFeed())}
                fetching={pagination.fetching}
                canFetchMore={pagination.canFetchMore}
                currentPage={pagination.page}
                refreshOnFocus
                items={postIds.map((id) => posts[id])}
                id={(post: GroupPost): string => post.id}
                hideScrollIndicator
                endOfItemsComponent={<Text style={styles.noResultsText}>{i18n.t("groups.noMorePosts")}</Text>}
                noResultsComponent={<Text style={styles.noResultsText}>{i18n.t("groups.noPosts")}</Text>}
                refresh={() => {
                    dispatch(refreshFetchedMyGroups());
                    dispatch(refreshFetchedMyGroups(true));
                    dispatch(refreshFetchedPostsFeed());
                }}
                renderItem={(post: GroupPost) => <GroupPostCard key={post.id} post={post} isFeed />}
                // Compensate for the top
                progressViewOffset={250}
                keyboardShouldPersistTaps="handled"
            />
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        titleWrapper: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
        },
        title: {
            fontSize: 20,
            marginLeft: 5,
            color: theme.text,
        },
        noResultsText: {
            color: theme.textLight,
            fontSize: 16,
        },
        feedTooltipIcon: {
            fontSize: 20,
            color: theme.textLight,
        },
    });
});

export default reduxConnector(withTheme(PostsFeedView));
