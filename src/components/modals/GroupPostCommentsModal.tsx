import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {Group, GroupPost, GroupVoteStatus, PostComment} from "../../model/groups";
import i18n from "i18n-js";
import {MaterialIcons} from "@expo/vector-icons";
import {MyThunkDispatch} from "../../state/types";
import CustomModal, {CustomModalClass, ModalActivator} from "./CustomModal";
import CommentTextInput, {CommentTextInputClass} from "../CommentTextInput";
import store from "../../state/store";
import {createPostComment, fetchPostComments} from "../../state/groups/actions";
import GroupCommentCard from "../cards/GroupCommentCard";
import GroupVoteButton from "../GroupVoteButton";
import Button from "../Button";

// Component props
export type GroupPostCommentsModalProps = {
    group: Group;
    post: GroupPost;
    activator?: ModalActivator;
} & ThemeProps;

type GroupPostCommentsModalState = {
    replyingTo: PostComment | null;
    expandedCommentId: string | null;
};

export class GroupPostCommentsModalClass extends React.Component<
    GroupPostCommentsModalProps,
    GroupPostCommentsModalState
> {
    modalRef = React.createRef<CustomModalClass>();
    commentTextInputRef = React.createRef<CommentTextInputClass>();

    constructor(props: GroupPostCommentsModalProps) {
        super(props);
        this.state = {replyingTo: null, expandedCommentId: null};
    }

    show(): void {
        this.modalRef.current?.show();
    }

    private setReplyingTo(comment: PostComment | null): void {
        this.setState({...this.state, replyingTo: comment});
        if (comment !== null) this.commentTextInputRef.current?.focus();
    }

    render(): JSX.Element {
        const {post, group, theme} = this.props;
        const {replyingTo, expandedCommentId} = this.state;

        const styles = themedStyles(theme);
        const dispatch = store.dispatch as MyThunkDispatch;

        return (
            <CustomModal
                ref={this.modalRef}
                animationType="slide"
                nonDismissable
                fullWidth
                fullHeight
                statusBarTranslucent={false}
                modalViewStyle={{paddingVertical: 0, paddingHorizontal: 0}}
                onShow={() => {
                    if (post && post.commentIds.length == 0) dispatch(fetchPostComments(group.id, post.id));
                }}
                onHide={() => {
                    this.setReplyingTo(null);
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
                                    {post.score} {i18n.t("groups.points")}
                                </Text>
                                <GroupVoteButton
                                    group={group}
                                    post={post}
                                    currentStatus={post.voteStatus}
                                    vote={GroupVoteStatus.Upvote}
                                    style={styles.topButton}
                                    iconStyle={styles.topButtonIcon}
                                />
                                <GroupVoteButton
                                    group={group}
                                    post={post}
                                    currentStatus={post.voteStatus}
                                    vote={GroupVoteStatus.Downvote}
                                    style={styles.topButton}
                                    iconStyle={styles.topButtonIcon}
                                />
                            </View>
                        </View>
                        <View style={styles.comments}>
                            {post.commentIds.map((id) => (
                                <GroupCommentCard
                                    key={`${group.id}-${post.id}-comment-${id}`}
                                    group={group}
                                    post={post}
                                    comment={post.comments[id]}
                                    closeComments={hide}
                                    onPressReplyTo={() => this.setReplyingTo(post.comments[id])}
                                    expanded={expandedCommentId === id}
                                    onExpand={() => this.setState({...this.state, expandedCommentId: id})}
                                    onCollapse={() => this.setState({...this.state, expandedCommentId: null})}
                                />
                            ))}
                        </View>
                        <View style={styles.bottom}>
                            <View style={styles.replyToContainer}>
                                {replyingTo && (
                                    <>
                                        <Button
                                            style={styles.replyToClose}
                                            icon={<MaterialIcons name="close" style={styles.replyToCloseIcon} />}
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
                                style={styles.input}
                                onSend={(text) =>
                                    (store.dispatch as MyThunkDispatch)(createPostComment(group.id, post.id, {text}))
                                }
                            />
                        </View>
                    </View>
                )}
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.cardBackground,
            padding: 0,
            marginBottom: 15,
        },
        top: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        comments: {
            flex: 1,
        },
        bottom: {
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 2,
            paddingBottom: 7,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: theme.componentBorder,
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

        input: {
            backgroundColor: theme.onboardingInputBackground,
            borderRadius: 20,
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
    });
});

export default withTheme(GroupPostCommentsModalClass);
