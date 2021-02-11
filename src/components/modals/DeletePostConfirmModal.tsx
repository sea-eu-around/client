import React from "react";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal from "./ConfirmationModal";
import {FontAwesome} from "@expo/vector-icons";
import i18n from "i18n-js";

export type DeletePostConfirmModalProps = ThemeProps & Partial<CustomModalProps>;

class DeletePostConfirmModal extends React.Component<DeletePostConfirmModalProps> {
    render() {
        const {theme, ...otherProps} = this.props;

        return (
            <ConfirmationModal
                title={i18n.t("groups.deletePost.title")}
                text={i18n.t("groups.deletePost.text")}
                icon={(props) => <FontAwesome name="warning" color={theme.error} {...props} />}
                buttons={[{preset: "cancel"}, {preset: "delete"}]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(DeletePostConfirmModal);
