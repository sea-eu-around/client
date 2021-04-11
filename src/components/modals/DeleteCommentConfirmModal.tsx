import React from "react";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal from "./ConfirmationModal";
import {FontAwesome} from "@expo/vector-icons";
import i18n from "i18n-js";
import store from "../../state/store";
import {deletePostComment} from "../../state/groups/actions";
import {GroupPost, PostComment} from "../../model/groups";
import {MyThunkDispatch} from "../../state/types";

export type DeleteCommentConfirmModalProps = ThemeProps &
    Partial<CustomModalProps> & {groupId: string; post: GroupPost; comment: PostComment};

class DeleteCommentConfirmModal extends React.Component<DeleteCommentConfirmModalProps> {
    render() {
        const {groupId, post, comment, theme, ...otherProps} = this.props;

        return (
            <ConfirmationModal
                title={i18n.t("groups.deleteComment.title")}
                text={i18n.t("groups.deleteComment.text")}
                icon={(props) => <FontAwesome name="warning" color={theme.error} {...props} />}
                buttons={[
                    {preset: "cancel"},
                    {
                        preset: "delete",
                        onPress: (hide) => {
                            hide();
                            (store.dispatch as MyThunkDispatch)(deletePostComment(groupId, post.id, comment.id));
                        },
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(DeleteCommentConfirmModal);
