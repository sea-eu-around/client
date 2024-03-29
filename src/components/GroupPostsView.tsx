import * as React from "react";
import {StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {Group, GroupPost, PostSortingOrder} from "../model/groups";
import {MaterialIcons} from "@expo/vector-icons";
import EditPostModal from "./modals/EditPostModal";
import InfiniteScroller, {OnScroll} from "./InfiniteScroller";
import {NavigationProp} from "@react-navigation/native";
import {GROUPS_POSTS_FETCH_LIMIT} from "../constants/config";
import {AppState, MyThunkDispatch, PaginatedState} from "../state/types";
import {fetchGroupPosts, refreshFetchedGroupPosts, setPostSortingOrder} from "../state/groups/actions";
import GroupPostCard from "./cards/GroupPostCard";
import PostSortingOrderPicker from "./PostSortingOrderPicker";
import {connect, ConnectedProps} from "react-redux";
import Button from "./Button";

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
        onRefresh?: () => void;
        onScroll?: OnScroll;
    };

class GroupPostsView extends React.Component<GroupPostsViewProps> {
    render(): JSX.Element {
        const {group, top, navigation, titleContainerStyle, sortOrder, onRefresh, onScroll, theme} = this.props;
        const styles = themedStyles(theme);
        const dispatch = this.props.dispatch as MyThunkDispatch;

        const pagination: PaginatedState = group
            ? group.postsPagination
            : {canFetchMore: true, fetching: true, page: 1};

        return (
            <>
                <InfiniteScroller
                    top={
                        <>
                            {top}
                            <View style={[styles.titleWrapper, titleContainerStyle]}>
                                <Text style={styles.title}>{i18n.t("groups.posts")}</Text>
                                <View style={styles.buttons}>
                                    {group && (
                                        <EditPostModal
                                            groupId={group.id}
                                            activator={(show) => (
                                                <Button
                                                    style={styles.button}
                                                    icon={<MaterialIcons style={styles.buttonIcon} name="add" />}
                                                    onPress={show}
                                                />
                                            )}
                                        />
                                    )}
                                    <PostSortingOrderPicker
                                        order={sortOrder}
                                        activator={(show) => (
                                            <Button
                                                style={styles.button}
                                                icon={<MaterialIcons style={styles.buttonIcon} name="sort" />}
                                                onPress={show}
                                            />
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
                    fetchMore={() => group && dispatch(fetchGroupPosts(group.id))}
                    fetching={pagination.fetching}
                    canFetchMore={pagination.canFetchMore}
                    currentPage={pagination.page}
                    items={group ? group.postIds.map((id) => group.posts[id]) : []}
                    id={(post: GroupPost): string => post.id}
                    hideScrollIndicator
                    endOfItemsComponent={<Text style={styles.noResultsText}>{i18n.t("groups.noMorePosts")}</Text>}
                    noResultsComponent={<Text style={styles.noResultsText}>{i18n.t("groups.noPosts")}</Text>}
                    refresh={() => {
                        if (group) {
                            dispatch(refreshFetchedGroupPosts(group.id));
                            if (onRefresh) onRefresh();
                        }
                    }}
                    renderItem={(post: GroupPost) => <GroupPostCard key={post.id} post={post} />}
                    progressViewOffset={350} // Compensate for the header
                    keyboardShouldPersistTaps="handled"
                    itemsContainerStyle={styles.itemsContainer}
                    onScroll={onScroll}
                />
            </>
        );
    }
}

const CONTENT_MAX_WIDTH = 800;

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        titleWrapper: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
            maxWidth: CONTENT_MAX_WIDTH,
            alignSelf: "center",
        },
        title: {
            fontSize: 20,
            color: theme.text,
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
            color: theme.textLight,
            fontSize: 16,
        },
        itemsContainer: {
            maxWidth: CONTENT_MAX_WIDTH,
            width: "100%",
            alignSelf: "center",
        },
    });
});

export default reduxConnector(withTheme(GroupPostsView));
