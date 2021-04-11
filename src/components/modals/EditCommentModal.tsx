import React from "react";
import {CustomModalClass, CustomModalProps} from "./CustomModal";
import {StyleSheet} from "react-native";
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
import {MAX_COMMENT_LENGTH, VALIDATOR_COMMENT_TEXT} from "../../validators";
import FormError from "../forms/FormError";

export type EditCommentModalProps = ThemeProps &
    Partial<CustomModalProps> & {groupId: string; post: GroupPost; comment: PostComment};

type EditCommentModalState = {text: string; error?: string};

export class EditCommentModalClass extends React.Component<EditCommentModalProps, EditCommentModalState> {
    modalRef = React.createRef<CustomModalClass>();

    constructor(props: EditCommentModalProps) {
        super(props);
        this.state = {text: props.comment.text, error: undefined};
    }

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {groupId, post, comment, theme, ...otherProps} = this.props;
        const {text, error} = this.state;

        const styles = themedStyles(theme);
        const dispatch = store.dispatch as MyThunkDispatch;

        const textInputStyle: Partial<ValidatedTextInputProps> = {
            wrapperStyle: {flex: 1},
            style: {flex: 1},
            inputStyle: {
                fontSize: 16,
                paddingVertical: 10,
                paddingHorizontal: 5,
                color: theme.text,
                textAlignVertical: "top",
            },
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
                            if (text != comment.text) dispatch(updatePostComment(groupId, post.id, comment.id, {text}));
                            hide();
                        },
                    },
                ]}
                additionalContent={() => (
                    <>
                        <ValidatedTextInput
                            value={text}
                            onChangeText={(text) => {
                                VALIDATOR_COMMENT_TEXT.validate(text)
                                    .then(() => this.setState({...this.state, text, error: undefined}))
                                    .catch((validation) =>
                                        this.setState({...this.state, text, error: validation.errors[0] || undefined}),
                                    );
                            }}
                            multiline
                            numberOfLines={4}
                            maxLength={MAX_COMMENT_LENGTH}
                            {...textInputStyle}
                        />
                        <FormError error={error} />
                    </>
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
            height: 200,
        },
    });
});

export default withTheme(EditCommentModalClass);
