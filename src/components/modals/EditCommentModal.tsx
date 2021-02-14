import React from "react";
import {CustomModalClass, CustomModalProps} from "./CustomModal";
import {Platform, StyleSheet, TextStyle} from "react-native";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {GroupPost, PostComment} from "../../model/groups";
import {preTheme} from "../../styles/utils";
import i18n from "i18n-js";
import ConfirmationModal from "./ConfirmationModal";
import {updatePostComment} from "../../state/groups/actions";
import store from "../../state/store";
import {MyThunkDispatch} from "../../state/types";
import ValidatedTextInput, {ValidatedTextInputProps} from "../ValidatedTextInput";

export type EditCommentModalProps = ThemeProps &
    Partial<CustomModalProps> & {groupId: string; post: GroupPost; comment: PostComment};

type EditCommentModalState = {text: string};

export class EditCommentModalClass extends React.Component<EditCommentModalProps, EditCommentModalState> {
    modalRef = React.createRef<CustomModalClass>();

    constructor(props: EditCommentModalProps) {
        super(props);
        this.state = {text: props.comment.text};
    }

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {groupId, post, comment, theme, ...otherProps} = this.props;
        const {text} = this.state;

        const styles = themedStyles(theme);

        const textInputStyle: Partial<ValidatedTextInputProps> = {
            wrapperStyle: {flex: 1},
            style: {flex: 1},
            inputStyle: {
                fontSize: 16,
                paddingVertical: 10,
                color: theme.text,
                textAlignVertical: "top",
            },
            inputFocusedStyle: Platform.OS === "web" ? ({outline: "none"} as TextStyle) : {},
            placeholderTextColor: theme.inputPlaceholder,
        };

        return (
            <ConfirmationModal
                title={i18n.t("groups.editComment.title")}
                buttons={[
                    {preset: "cancel"},
                    {
                        preset: "confirm",
                        onPress: (hide) => {
                            if (text != comment.text) {
                                (store.dispatch as MyThunkDispatch)(
                                    updatePostComment(groupId, post.id, comment.id, {text}),
                                );
                            }
                            hide();
                        },
                    },
                ]}
                additionalContent={() => (
                    <ValidatedTextInput
                        value={text}
                        onChangeText={(text) => this.setState({...this.state, text})}
                        multiline
                        numberOfLines={4}
                        {...textInputStyle}
                    />
                )}
                contentContainerStyle={styles.contentContainer}
                {...otherProps}
            />
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        contentContainer: {
            height: 150,
        },
    });
});

export default withTheme(EditCommentModalClass);
