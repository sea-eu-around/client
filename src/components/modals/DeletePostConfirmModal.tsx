import React from "react";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalClass} from "./ConfirmationModal";
import {FontAwesome} from "@expo/vector-icons";
import i18n from "i18n-js";
import store from "../../state/store";
import {deleteGroupPost} from "../../state/groups/actions";
import {GroupPost} from "../../model/groups";
import {MyThunkDispatch} from "../../state/types";

export type DeletePostConfirmModalProps = ThemeProps & Partial<CustomModalProps> & {groupId: string; post: GroupPost};

export class DeletePostConfirmModalClass extends React.Component<DeletePostConfirmModalProps> {
    private modalRef = React.createRef<ConfirmationModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {groupId, post, theme, ...otherProps} = this.props;
        const dispatch = store.dispatch as MyThunkDispatch;

        return (
            <ConfirmationModal
                ref={this.modalRef}
                title={i18n.t("groups.deletePost.title")}
                text={i18n.t("groups.deletePost.text")}
                icon={(props) => <FontAwesome name="warning" color={theme.error} {...props} />}
                buttons={[
                    {preset: "cancel"},
                    {
                        preset: "delete",
                        // No need to hide the modal since it will be unmounted anyway
                        onPress: () => dispatch(deleteGroupPost(groupId, post.id)),
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(DeletePostConfirmModalClass);
