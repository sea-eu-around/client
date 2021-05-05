import * as React from "react";
import {ActivityIndicator, Keyboard, RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {Theme, ThemeKey, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {GroupPost, GroupVoteStatus, PostComment} from "../../model/groups";
import i18n from "i18n-js";
import {MaterialIcons} from "@expo/vector-icons";
import {MyThunkDispatch} from "../../state/types";
import CustomModal, {CustomModalClass, ModalActivator} from "./CustomModal";
import CommentTextInput, {CommentTextInputClass} from "../CommentTextInput";
import store from "../../state/store";
import {createPostComment, fetchPostComments, fetchPostCommentsRefresh} from "../../state/groups/actions";
import GroupCommentCard from "../cards/GroupCommentCard";
import GroupVoteButton from "../GroupVoteButton";
import Button from "../Button";
import {CreatePostCommentDto} from "../../api/dto";
import {MAX_COMMENTS_DEPTH} from "../../constants/config";
import Animated, {Easing} from "react-native-reanimated";
import {animateValue} from "../../polyfills";
import {TouchableOpacity} from "react-native";
import {SafeAreaInsetsContext} from "react-native-safe-area-context";
import {statusBarRef} from "../ThemedStatusBar";
import QuickFormReport, {QuickFormReportClass} from "../forms/QuickFormReport";
import {ReportEntityType} from "../../constants/reports";

// Component props
export type GroupPostCommentsModalProps = {
    groupId: string;
    post: GroupPost;
    activator?: ModalActivator;
    adminView: boolean;
} & ThemeProps;

type GroupPostCommentsModalState = {
    replyingTo: PostComment | null;
    reporting: PostComment | null;
};

export class GroupPostCommentsModalClass extends React.Component<
    GroupPostCommentsModalProps,
    GroupPostCommentsModalState
> {
    private formReportRef = React.createRef<QuickFormReportClass>();
    modalRef = React.createRef<CustomModalClass>();
    commentTextInputRef = React.createRef<CommentTextInputClass>();
    collapseCurrentlyExpanded: (() => void) | null = null;
    initialStatusBarStyle: ThemeKey | undefined = undefined;

    constructor(props: GroupPostCommentsModalProps) {
        super(props);
        this.state = {replyingTo: null, reporting: null};
    }

    show(): void {
        this.modalRef.current?.show();

        const {theme} = this.props;
        this.initialStatusBarStyle = statusBarRef.current?.getStyle();
        statusBarRef.current?.setStyle(theme.id === "dark" ? "light" : "dark");
    }

    private setReplyingTo(comment: PostComment | null): void {
        // If this comment would exceed the maximum depth, respond to its parent instead
        if (comment && comment.parentId && comment.depth >= MAX_COMMENTS_DEPTH) {
            const parent = this.props.post.comments[comment.parentId];
            if (parent) {
                this.setReplyingTo(parent);
                return;
            }
        }

        this.setState({...this.state, replyingTo: comment});
        if (comment !== null) this.commentTextInputRef.current?.focus();
    }

    private createCommentComponent = (commentId: string, hide: () => void): JSX.Element => {
        const {post, groupId, adminView} = this.props;

        const comment = post.comments[commentId];
        const children = comment.childrenIds.map((id: string) => this.createCommentComponent(id, hide));
        const childrenContainerRef = React.createRef<CommentChildrenContainer>();

        return (
            <React.Fragment key={`${groupId}-${post.id}-comment-${comment.id}`}>
                <GroupCommentCard
                    groupId={groupId}
                    post={post}
                    comment={comment}
                    closeComments={hide}
                    onPressReplyTo={() => this.setReplyingTo(comment)}
                    onExpand={(collapse) => {
                        if (this.collapseCurrentlyExpanded) this.collapseCurrentlyExpanded();
                        this.collapseCurrentlyExpanded = collapse;
                        Keyboard.dismiss();
                    }}
                    onCollapse={() => {
                        this.collapseCurrentlyExpanded = null;
                        Keyboard.dismiss();
                    }}
                    toggleChildren={() => childrenContainerRef.current?.toggle()}
                    adminView={adminView}
                    openReportForm={() => {
                        this.setState({reporting: comment});
                        this.formReportRef.current?.open();
                    }}
                />
                <CommentChildrenContainer ref={childrenContainerRef}>{children}</CommentChildrenContainer>
            </React.Fragment>
        );
    };

    private fetchFirstComments(): void {
        const {post} = this.props;

        if (post && post.commentIds.length === 0) {
            const pagination = post.commentsPagination;
            if (pagination.page === 1) this.fetchMore();
        }
    }

    private fetchMore(): void {
        const {groupId, post} = this.props;
        const dispatch = store.dispatch as MyThunkDispatch;

        if (post && post.commentsPagination.canFetchMore && !post.commentsPagination.fetching)
            dispatch(fetchPostComments(groupId, post.id));
    }

    componentDidUpdate(oldProps: GroupPostCommentsModalProps): void {
        const oldPagination = oldProps.post.commentsPagination;
        const pagination = this.props.post.commentsPagination;
        if (oldPagination.page > 1 && pagination.page === 1) this.fetchFirstComments();
    }

    render(): JSX.Element {
        const {post, groupId, theme} = this.props;
        const {replyingTo} = this.state;

        const styles = themedStyles(theme);
        const dispatch = store.dispatch as MyThunkDispatch;
        const pagination = post.commentsPagination;

        return (
            <>
                <SafeAreaInsetsContext.Consumer>
                    {(insets) => (
                        <CustomModal
                            ref={this.modalRef}
                            animationType="slide"
                            fullHeight
                            statusBarTranslucent
                            modalViewStyle={{
                                paddingTop: insets?.top || 0,
                                paddingBottom: insets?.bottom || 0,
                                paddingHorizontal: 0,
                                width: "100%",
                                maxWidth: 1000,
                            }}
                            onShow={() => this.fetchFirstComments()}
                            onHide={() => {
                                this.setReplyingTo(null);
                                statusBarRef.current?.setStyle(this.initialStatusBarStyle);
                            }}
                            renderContent={(hide) => (
                                <View style={styles.container}>
                                    <View style={styles.top}>
                                        <View style={{flexDirection: "row", alignItems: "center"}}>
                                            <Button
                                                style={styles.topButton}
                                                icon={<MaterialIcons name="close" style={styles.topButtonIcon} />}
                                                onPress={hide}
                                            />
                                        </View>
                                        <View style={{flexDirection: "row", alignItems: "center"}}>
                                            <Text style={styles.points}>
                                                {post.score === 0
                                                    ? i18n.t("groups.points.zero")
                                                    : post.score === 1
                                                    ? i18n.t("groups.points.singular")
                                                    : i18n.t("groups.points.plural", {num: post.score})}
                                            </Text>
                                            <GroupVoteButton
                                                groupId={groupId}
                                                post={post}
                                                currentStatus={post.voteStatus}
                                                vote={GroupVoteStatus.Upvote}
                                                style={styles.topButton}
                                                iconStyle={styles.topButtonIcon}
                                            />
                                            <GroupVoteButton
                                                groupId={groupId}
                                                post={post}
                                                currentStatus={post.voteStatus}
                                                vote={GroupVoteStatus.Downvote}
                                                style={styles.topButton}
                                                iconStyle={styles.topButtonIcon}
                                            />
                                        </View>
                                    </View>
                                    <ScrollView
                                        style={styles.commentsScrollView}
                                        contentContainerStyle={styles.comments}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={pagination.fetching}
                                                onRefresh={() => dispatch(fetchPostCommentsRefresh(groupId, post.id))}
                                            />
                                        }
                                    >
                                        {post.commentIds.length === 0 && !pagination.fetching && (
                                            <Text style={styles.noCommentsText}>{i18n.t("groups.comments.none")}</Text>
                                        )}
                                        {post.commentIds.map(
                                            // Render all parent comments (this will recursively render the children)
                                            (id) =>
                                                !post.comments[id].parentId && this.createCommentComponent(id, hide),
                                        )}
                                        {pagination.fetching && post.commentIds.length > 0 && (
                                            <ActivityIndicator size="large" color={theme.accent} />
                                        )}
                                        {pagination.canFetchMore && !pagination.fetching && (
                                            <TouchableOpacity
                                                style={styles.viewMoreComments}
                                                onPress={() => this.fetchMore()}
                                            >
                                                <Text style={styles.viewMoreCommentsText}>
                                                    {i18n.t("groups.comments.viewMore", {
                                                        n: post.commentsCount - post.commentIds.length,
                                                    })}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </ScrollView>
                                    <View style={styles.bottom}>
                                        <View style={styles.replyToContainer}>
                                            {replyingTo && (
                                                <>
                                                    <Button
                                                        style={styles.replyToClose}
                                                        icon={
                                                            <MaterialIcons
                                                                name="close"
                                                                style={styles.replyToCloseIcon}
                                                            />
                                                        }
                                                        onPress={() => this.setReplyingTo(null)}
                                                    />
                                                    <Text style={styles.replyToText}>
                                                        {i18n.t("groups.comments.replyTo", {
                                                            name: `${replyingTo.creator.firstName} ${replyingTo.creator.lastName}`,
                                                        })}
                                                    </Text>
                                                </>
                                            )}
                                        </View>
                                        <CommentTextInput
                                            ref={this.commentTextInputRef}
                                            onSend={(text) => {
                                                const dto: CreatePostCommentDto = {
                                                    text,
                                                    parentId: replyingTo?.id || undefined,
                                                };
                                                dispatch(createPostComment(groupId, post.id, dto));
                                                this.setState({...this.state, replyingTo: null});
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        />
                    )}
                </SafeAreaInsetsContext.Consumer>
                <QuickFormReport
                    ref={this.formReportRef}
                    entityType={ReportEntityType.COMMENT_ENTITY}
                    entity={this.state.reporting}
                    modalMode
                />
            </>
        );
    }
}

class CommentChildrenContainer extends React.Component<React.PropsWithChildren<unknown>> {
    private EXTRA_HEIGHT_OFFSET = 100;
    initialHeight = 0;
    maxHeight = new Animated.Value<number>(1e6);
    open = true;

    toggle(): void {
        this.open = !this.open;
        const toValue = this.open ? this.initialHeight + this.EXTRA_HEIGHT_OFFSET : 0;
        animateValue(this.maxHeight, {toValue, duration: 250, easing: Easing.cubic});
    }

    render(): JSX.Element {
        return (
            <Animated.View
                style={{maxHeight: this.maxHeight, overflow: "hidden"}}
                onLayout={(e) => {
                    const h = e.nativeEvent.layout.height;
                    if (h > this.initialHeight) {
                        this.initialHeight = h;
                        if (this.open) this.maxHeight.setValue(this.initialHeight + this.EXTRA_HEIGHT_OFFSET);
                    }
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            height: "100%",
            minHeight: "100%",
            backgroundColor: theme.cardBackground,
            padding: 0,
            marginBottom: 15,
            paddingBottom: 30,
        },
        top: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        commentsScrollView: {
            flex: 1,
        },
        comments: {
            paddingBottom: 30,
        },
        bottom: {
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 2,
            paddingBottom: 7,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: theme.componentBorder,
            backgroundColor: theme.cardBackground,
        },

        points: {
            color: theme.text,
            fontSize: 14,
            marginRight: 5,
        },
        topButton: {
            padding: 10,
        },
        topButtonIcon: {
            fontSize: 24,
            color: theme.textLight,
        },

        noCommentsText: {
            fontSize: 16,
            color: theme.textLight,
            alignSelf: "center",
            textAlign: "center",
            marginTop: 25,
            maxWidth: 250,
        },

        replyToContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 2,
        },
        replyToText: {color: theme.textLight},
        replyToClose: {
            padding: 5,
        },
        replyToCloseIcon: {
            color: theme.textLight,
            fontSize: 20,
        },

        viewMoreComments: {
            paddingVertical: 15,
            paddingHorizontal: 10,
            backgroundColor: theme.accentSlight,
        },
        viewMoreCommentsText: {
            color: theme.accent,
        },
    });
});

export default withTheme(GroupPostCommentsModalClass);
