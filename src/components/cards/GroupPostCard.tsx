import * as React from "react";
import {TouchableOpacity, StyleSheet, Text, View} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {Group, GroupPost, GroupVoteStatus} from "../../model/groups";
import ReadMore from "react-native-read-more-text";
import i18n from "i18n-js";
import {MaterialIcons} from "@expo/vector-icons";
import GroupPostCommentsModal, {GroupPostCommentsModalClass} from "../modals/GroupPostCommentsModal";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import EditPostModal, {EditPostModalClass} from "../modals/EditPostModal";
import DeletePostConfirmModal from "../modals/DeletePostConfirmModal";
import PostHeader from "../PostHeader";
import {formatPostDate} from "../../model/utils";
import Button from "../Button";
import GroupVoteButton from "../GroupVoteButton";

const reduxConnector = connect((state: AppState) => ({
    localUser: state.profile.user,
}));

// Component props
type GroupPostCardProps = {
    group: Group | null;
    post: GroupPost | null;
} & ThemeProps &
    ConnectedProps<typeof reduxConnector>;

class GroupPostCard extends React.Component<GroupPostCardProps> {
    commentsModalRef = React.createRef<GroupPostCommentsModalClass>();
    editPostModalRef = React.createRef<EditPostModalClass>();

    openComments(): void {
        this.commentsModalRef.current?.show();
    }

    render(): JSX.Element {
        const {post, group, localUser, theme} = this.props;

        const styles = themedStyles(theme);
        const fromLocal = post && localUser && post.creator.id === localUser.id;

        return (
            <TouchableOpacity style={styles.container} activeOpacity={0.9}>
                <View style={styles.top}>
                    <PostHeader profile={post?.creator || null} subtitle={post && formatPostDate(post)} />
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        {fromLocal && (
                            <>
                                <Button
                                    style={styles.topButton}
                                    onPress={() => this.editPostModalRef.current?.show()}
                                    icon={<MaterialIcons style={styles.topButtonIcon} name="edit" />}
                                />
                                {group && post && (
                                    <DeletePostConfirmModal
                                        group={group}
                                        post={post}
                                        activator={(show) => (
                                            <Button
                                                style={styles.topButton}
                                                onPress={show}
                                                icon={<MaterialIcons style={styles.topButtonIcon} name="delete" />}
                                            />
                                        )}
                                    />
                                )}
                            </>
                        )}
                    </View>
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
                            {post?.score} {i18n.t("groups.points")}
                        </Text>
                        <Text style={styles.bottomText}>17 comments</Text>
                    </TouchableOpacity>
                    {group && post && (
                        <View style={{flexDirection: "row"}}>
                            <GroupVoteButton
                                group={group}
                                post={post}
                                currentStatus={post.voteStatus}
                                vote={GroupVoteStatus.Upvote}
                                style={styles.bottomButton}
                                iconStyle={styles.bottomButtonIcon}
                            />
                            <GroupVoteButton
                                group={group}
                                post={post}
                                currentStatus={post.voteStatus}
                                vote={GroupVoteStatus.Downvote}
                                style={styles.bottomButton}
                                iconStyle={styles.bottomButtonIcon}
                            />
                        </View>
                    )}
                </View>
                {post && group && <GroupPostCommentsModal ref={this.commentsModalRef} group={group} post={post} />}
                {post && group && <EditPostModal ref={this.editPostModalRef} group={group} post={post} />}
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
            lineHeight: 20,
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
        topButton: {
            marginLeft: 5,
            padding: 5,
        },
        topButtonIcon: {
            fontSize: 18,
            color: theme.textLight,
        },
    });
});

export default reduxConnector(withTheme(GroupPostCard));
