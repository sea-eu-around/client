import * as React from "react";
import {TouchableOpacity, StyleSheet, Text, View} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {GroupPost, GroupVoteStatus} from "../../model/groups";
import i18n from "i18n-js";
import GroupPostCommentsModal, {GroupPostCommentsModalClass} from "../modals/GroupPostCommentsModal";
import {connect, ConnectedProps} from "react-redux";
import {AppState, MyThunkDispatch} from "../../state/types";
import EditPostModal, {EditPostModalClass} from "../modals/EditPostModal";
import PostHeader from "../PostHeader";
import {formatPostDate} from "../../model/utils";
import GroupVoteButton from "../GroupVoteButton";
import {fetchGroup} from "../../state/groups/actions";
import {GroupRole} from "../../api/dto";
import GroupPostMenu, {GroupPostMenuClass} from "../GroupPostMenu";
import {ReadMore} from "../ReadMore";

const reduxConnector = connect((state: AppState) => ({
    groupsDict: state.groups.groupsDict,
}));

// Component props
type GroupPostCardProps = {post: GroupPost | null; isFeed?: boolean} & ThemeProps &
    ConnectedProps<typeof reduxConnector>;

class GroupPostCard extends React.Component<GroupPostCardProps> {
    commentsModalRef = React.createRef<GroupPostCommentsModalClass>();
    editPostModalRef = React.createRef<EditPostModalClass>();
    menuRef = React.createRef<GroupPostMenuClass>();

    openComments(): void {
        this.commentsModalRef.current?.show();
    }

    componentDidMount(): void {
        this.fetchGroupIfNeeded();
    }

    componentDidUpdate(oldProps: GroupPostCardProps): void {
        const {post} = this.props;

        // If the post has changed
        if (post && (!oldProps.post || oldProps.post.id !== post.id)) this.fetchGroupIfNeeded();
    }

    private fetchGroupIfNeeded(): void {
        const {post, groupsDict, dispatch} = this.props;
        if (post) {
            const groupId = post.groupId;
            if (!groupsDict[groupId]) (dispatch as MyThunkDispatch)(fetchGroup(groupId));
        }
    }

    render(): JSX.Element {
        const {post, isFeed, groupsDict, theme} = this.props;

        const styles = themedStyles(theme);
        // const fromLocal = post && localUser && post.creator.id === localUser.id;
        const groupId = post?.groupId || null;
        const group = groupId ? groupsDict[groupId] || null : null;
        const isAdmin = group?.myRole == GroupRole.Admin;

        return (
            <TouchableOpacity style={styles.container} activeOpacity={0.9}>
                <View style={styles.top}>
                    <PostHeader
                        profile={post?.creator || null}
                        subtitle={post && formatPostDate(post)}
                        group={group}
                        isFeed={isFeed}
                        openPostMenu={() => group && post && this.menuRef.current?.show(group, post)}
                    />
                </View>
                {post && (
                    <ReadMore
                        numberOfLines={5}
                        renderTruncatedFooter={(handlePress) => (
                            <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
                                <Text style={[styles.postText, styles.textFooter]}>... {i18n.t("showMore")}</Text>
                            </TouchableOpacity>
                        )}
                        renderRevealedFooter={(handlePress) => (
                            <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
                                <Text style={[styles.postText, styles.textFooter]}>{i18n.t("showLess")}</Text>
                            </TouchableOpacity>
                        )}
                    >
                        <Text style={styles.postText}>{post?.text}</Text>
                    </ReadMore>
                )}
                <View style={styles.bottom}>
                    <TouchableOpacity onPress={() => this.openComments()}>
                        <Text style={styles.bottomText}>
                            {post
                                ? post.score === 0
                                    ? i18n.t("groups.points.zero")
                                    : post.score === 1
                                    ? i18n.t("groups.points.singular")
                                    : i18n.t("groups.points.plural", {num: post.score})
                                : ""}
                        </Text>
                        <Text style={styles.bottomText}>
                            {post &&
                                i18n.t(
                                    `groups.comments.${
                                        post.commentsCount === 0
                                            ? "zero"
                                            : post.commentsCount === 1
                                            ? "singular"
                                            : "plural"
                                    }`,
                                    {num: post.commentsCount},
                                )}
                        </Text>
                    </TouchableOpacity>
                    {groupId && post && (
                        <View style={{flexDirection: "row"}}>
                            <GroupVoteButton
                                groupId={groupId}
                                post={post}
                                currentStatus={post.voteStatus}
                                vote={GroupVoteStatus.Upvote}
                                style={styles.bottomButton}
                                iconStyle={styles.bottomButtonIcon}
                            />
                            <GroupVoteButton
                                groupId={groupId}
                                post={post}
                                currentStatus={post.voteStatus}
                                vote={GroupVoteStatus.Downvote}
                                style={styles.bottomButton}
                                iconStyle={styles.bottomButtonIcon}
                            />
                        </View>
                    )}
                </View>
                {groupId && post && (
                    <>
                        <GroupPostCommentsModal
                            ref={this.commentsModalRef}
                            groupId={groupId}
                            post={post}
                            adminView={isAdmin}
                        />
                        <EditPostModal ref={this.editPostModalRef} groupId={groupId} post={post} />
                    </>
                )}
                <GroupPostMenu ref={this.menuRef} />
            </TouchableOpacity>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            backgroundColor: theme.cardBackground,
            padding: 10,
            marginBottom: 15,
            borderRadius: 10,
        },
        top: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
        },
        bottom: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
        },

        postText: {
            fontSize: 16,
            color: theme.text,
            lineHeight: 21,
        },
        textFooter: {
            color: theme.accent,
        },

        bottomText: {
            fontSize: 13,
            color: theme.textLight,
        },
        bottomButton: {
            marginLeft: 15,
            padding: 5,
        },
        bottomButtonIcon: {
            fontSize: 24,
            color: theme.textLight,
        },
    });
});

export default reduxConnector(withTheme(GroupPostCard));
