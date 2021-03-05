import * as React from "react";
import {TouchableOpacity, StyleSheet, Text, View} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {GroupPost, GroupVoteStatus, PostComment} from "../../model/groups";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import {rootNavigate} from "../../navigation/utils";
import {formatCommentDate} from "../../model/utils";
import ReAnimated, {Easing} from "react-native-reanimated";
import {animateValue} from "../../polyfills";
import {MaterialIcons} from "@expo/vector-icons";
import GroupVoteButton from "../GroupVoteButton";
import QuickFormReport from "../forms/QuickFormReport";
import {ReportEntityType} from "../../constants/reports";
import ProfileAvatar from "../ProfileAvatar";
import EditCommentModal from "../modals/EditCommentModal";
import DeleteCommentConfirmModal from "../modals/DeleteCommentConfirmModal";
import Button from "../Button";
import {ReadMore} from "../ReadMore";

const reduxConnector = connect((state: AppState) => ({
    localUser: state.profile.user,
}));

// Component props
type GroupCommentCardProps = {
    groupId: string;
    post: GroupPost | null;
    comment: PostComment | null;
    closeComments: () => void;
    onPressReplyTo: () => void;
    onExpand?: (collapse: () => void) => void;
    onCollapse?: () => void;
    toggleChildren: () => void;
    adminView: boolean;
} & ThemeProps &
    ConnectedProps<typeof reduxConnector>;

// Component state
type GroupCommentCardState = {
    expanded: boolean;
};

const EXPANDED_BOTTOM_HEIGHT = 35;
const DEPTH_OFFSET = 8;
const BORDER_LEFT_WIDTH = 4;

class GroupCommentCard extends React.Component<GroupCommentCardProps, GroupCommentCardState> {
    private bottomHeight = new ReAnimated.Value<number>(0);

    constructor(props: GroupCommentCardProps) {
        super(props);
        this.state = {expanded: false};
    }

    private setExpanded(expanded: boolean): void {
        const {onExpand, onCollapse} = this.props;

        this.setState({...this.state, expanded});
        animateValue(this.bottomHeight, {
            toValue: expanded ? EXPANDED_BOTTOM_HEIGHT : 0,
            duration: 100,
            easing: Easing.linear,
        });

        if (!expanded && onCollapse) onCollapse();
        if (expanded && onExpand) onExpand(() => this.setExpanded(false));
    }

    render(): JSX.Element {
        const {
            comment,
            post,
            groupId,
            closeComments,
            onPressReplyTo,
            localUser,
            theme,
            adminView,
            toggleChildren,
            ...otherProps
        } = this.props;
        const {expanded} = this.state;

        const styles = themedStyles(theme);
        const fromLocal = post && localUser && post.creator.id === localUser.id;
        const name = comment ? `${comment.creator.firstName} ${comment.creator.lastName}` : "";

        const depth = comment?.depth || 0;

        return (
            <TouchableOpacity
                style={[styles.outerContainer, expanded ? styles.outerContainerExpanded : {}]}
                activeOpacity={0.9}
                onPress={() => this.setExpanded(!this.state.expanded)}
                onLongPress={() => toggleChildren()}
                delayLongPress={250}
                {...otherProps}
            >
                <View
                    style={[
                        styles.innerContainer,
                        expanded ? styles.innerContainerExpanded : {},
                        {marginLeft: depth * DEPTH_OFFSET, borderLeftWidth: depth > 0 ? BORDER_LEFT_WIDTH : 0},
                    ]}
                >
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <ProfileAvatar
                            profile={comment?.creator}
                            size={32}
                            containerStyle={styles.avatarContainer}
                            rounded
                            onPress={() => {
                                if (comment) {
                                    closeComments();
                                    rootNavigate("ProfileScreen", {id: comment.creator.id});
                                }
                            }}
                        />
                        <View style={styles.content}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={[styles.topText, styles.name]}>{name}</Text>
                                <Text style={styles.topText}>{comment && ` - ${formatCommentDate(comment)}`}</Text>
                            </View>
                            <ReadMore
                                numberOfLines={3}
                                renderTruncatedFooter={(handlePress) => (
                                    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
                                        <Text style={[styles.text, styles.textFooter]}>... {i18n.t("showMore")}</Text>
                                    </TouchableOpacity>
                                )}
                                renderRevealedFooter={(handlePress) => (
                                    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
                                        <Text style={[styles.text, styles.textFooter]}>{i18n.t("showLess")}</Text>
                                    </TouchableOpacity>
                                )}
                            >
                                <Text style={styles.text}>{comment?.text}</Text>
                            </ReadMore>
                        </View>
                    </View>
                    {/* Comment footer */}
                    {post && comment && (
                        <ReAnimated.View
                            style={[styles.bottom, {height: this.bottomHeight, opacity: expanded ? 1 : 0}]}
                        >
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                {fromLocal && (
                                    <EditCommentModal
                                        groupId={groupId}
                                        post={post}
                                        comment={comment}
                                        activator={(show) => (
                                            <Button
                                                style={styles.bottomButton}
                                                icon={<MaterialIcons style={styles.bottomButtonIcon} name="edit" />}
                                                onPress={show}
                                            />
                                        )}
                                    />
                                )}
                                {(adminView || fromLocal) && (
                                    <DeleteCommentConfirmModal
                                        groupId={groupId}
                                        post={post}
                                        comment={comment}
                                        activator={(show) => (
                                            <Button
                                                style={styles.bottomButton}
                                                icon={<MaterialIcons style={styles.bottomButtonIcon} name="delete" />}
                                                onPress={show}
                                            />
                                        )}
                                    />
                                )}
                                {!fromLocal && (
                                    <QuickFormReport
                                        entityType={ReportEntityType.COMMENT_ENTITY}
                                        entity={comment}
                                        activator={(show) => (
                                            <Button
                                                style={styles.bottomButton}
                                                icon={<MaterialIcons style={styles.bottomButtonIcon} name="report" />}
                                                onPress={show}
                                            />
                                        )}
                                    />
                                )}
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Button
                                    style={styles.bottomButton}
                                    icon={<MaterialIcons style={styles.bottomButtonIcon} name="reply" />}
                                    onPress={onPressReplyTo}
                                />
                                <GroupVoteButton
                                    groupId={groupId}
                                    post={post}
                                    comment={comment}
                                    style={styles.bottomButton}
                                    currentStatus={comment.voteStatus}
                                    vote={GroupVoteStatus.Upvote}
                                />
                                <GroupVoteButton
                                    groupId={groupId}
                                    post={post}
                                    comment={comment}
                                    style={styles.bottomButton}
                                    currentStatus={comment.voteStatus}
                                    vote={GroupVoteStatus.Downvote}
                                />
                            </View>
                        </ReAnimated.View>
                    )}
                </View>
            </TouchableOpacity>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        outerContainer: {
            width: "100%",
            backgroundColor: theme.cardBackground,
        },
        outerContainerExpanded: {},
        innerContainer: {
            borderLeftColor: theme.componentBorder,
            padding: 10,
        },
        innerContainerExpanded: {
            backgroundColor: theme.accentSlight,
        },

        bottom: {
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            overflow: "hidden",
        },

        avatarContainer: {
            backgroundColor: theme.accentSlight,
            marginRight: 8,
        },
        topText: {
            fontSize: 14,
            color: theme.textLight,
        },
        name: {},
        content: {
            flex: 1,
        },
        text: {
            fontSize: 13,
            color: theme.text,
        },
        textFooter: {
            color: theme.accent,
        },

        bottomButton: {
            marginHorizontal: 10,
        },
        bottomButtonIcon: {
            fontSize: 24,
            color: theme.textLight,
        },
    });
});

export default reduxConnector(withTheme(GroupCommentCard));
