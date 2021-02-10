import * as React from "react";
import {TouchableOpacity, TouchableOpacityProps, StyleSheet, Text, View, TextInput} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {Group, GroupPost} from "../../model/groups";
import EnlargeableAvatar from "../EnlargeableAvatar";
import ReadMore from "react-native-read-more-text";
import i18n from "i18n-js";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {AppState, MyThunkDispatch} from "../../state/types";
import {connect} from "react-redux";
import CustomModal, {CustomModalClass, ModalActivator} from "./CustomModal";
import CommentTextInput from "../CommentTextInput";
import store from "../../state/store";
import {createPostComment} from "../../state/groups/actions";

const reduxConnector = connect((state: AppState) => ({
    groupsDict: state.groups.groupsDict,
}));

// Component props
type GroupPostCommentsModalProps = {
    group: Group;
    post: GroupPost;
    activator?: ModalActivator;
} & TouchableOpacityProps &
    ThemeProps;

export class GroupPostCommentsModalClass extends React.Component<GroupPostCommentsModalProps> {
    modalRef = React.createRef<CustomModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {post, group, theme, style, ...otherProps} = this.props;

        const styles = themedStyles(theme);

        return (
            <CustomModal
                ref={this.modalRef}
                animationType="slide"
                nonDismissable
                fullWidth
                fullHeight
                statusBarTranslucent={false}
                modalViewStyle={{paddingVertical: 0, paddingHorizontal: 0}}
                renderContent={(hide) => (
                    <View style={styles.container}>
                        <View style={styles.top}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <TouchableOpacity onPress={hide} style={styles.topButton}>
                                    <MaterialIcons name="close" style={styles.topButtonIcon} />
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={styles.points}>19 points</Text>
                                <TouchableOpacity onPress={hide} style={styles.topButton}>
                                    <MaterialIcons name="arrow-upward" style={styles.topButtonIcon} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={hide} style={styles.topButton}>
                                    <MaterialIcons name="arrow-downward" style={styles.topButtonIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.comments}>
                            <Text>{post.commentIds.map((id) => id)}</Text>
                        </View>
                        <View style={styles.bottom}>
                            <CommentTextInput
                                style={styles.input}
                                onSend={(text) =>
                                    (store.dispatch as MyThunkDispatch)(createPostComment(group.id, post.id, {text}))
                                }
                            />
                        </View>
                    </View>
                )}
                {...otherProps}
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
            backgroundColor: "red",
        },
        bottom: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
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

        avatarContainer: {
            width: 40,
            height: 40,
            backgroundColor: theme.accentSlight,
            marginRight: 10,
        },
        name: {
            fontSize: 18,
            color: theme.text,
        },
        postText: {
            fontSize: 16,
            color: theme.text,
            lineHeight: 20,
        },
        textFooter: {
            color: theme.accent,
        },

        input: {
            flex: 1,
            backgroundColor: theme.onboardingInputBackground,
            borderRadius: 20,
            marginVertical: 10,
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

export default withTheme(GroupPostCommentsModalClass);
