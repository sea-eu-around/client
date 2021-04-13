import * as React from "react";
import {StyleSheet, StyleProp, ViewStyle, TextStyle} from "react-native";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {PostComment} from "../model/groups";
import {MaterialIcons} from "@expo/vector-icons";
import {setVote} from "../state/groups/actions";
import {GroupPost, GroupVoteStatus} from "../model/groups";
import store from "../state/store";
import {MyThunkDispatch} from "../state/types";
import Button from "./Button";
import themes from "../constants/themes";

// Component props
type GroupVoteButtonProps = {
    vote: GroupVoteStatus;
    currentStatus: GroupVoteStatus;
    groupId: string;
    post: GroupPost;
    comment?: PostComment;
    style?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<TextStyle>;
} & ThemeProps;

class GroupVoteButton extends React.Component<GroupVoteButtonProps> {
    render(): JSX.Element {
        const {groupId, post, comment, vote, currentStatus, theme, style, iconStyle} = this.props;

        const styles = themedStyles(theme);
        const dispatch = store.dispatch as MyThunkDispatch;
        const isSet = vote === currentStatus;

        return (
            <Button
                onPress={() => {
                    const val = isSet ? GroupVoteStatus.Neutral : vote;
                    dispatch(setVote(groupId, post.id, comment?.id || null, val, currentStatus));
                }}
                icon={
                    <MaterialIcons
                        name={vote === GroupVoteStatus.Upvote ? "arrow-upward" : "arrow-downward"}
                        style={[styles.icon, iconStyle, styles.iconOverride, isSet && styles.nonNeutralIcon]}
                    />
                }
                style={style}
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        icon: {
            fontSize: 20,
        },
        iconOverride: {
            color: themes.light.textLight,
            opacity: 0.5,
        },
        nonNeutralIcon: {
            color: theme.accent,
            opacity: 1,
        },
    });
});

export default withTheme(GroupVoteButton);
