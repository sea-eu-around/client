import React from "react";
import {rootNavigate} from "../../navigation/utils";
import i18n from "i18n-js";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal from "./ConfirmationModal";

export type TOSDeclinedModalProps = ThemeProps & Partial<CustomModalProps>;

class TOSDeclinedModal extends React.Component<TOSDeclinedModalProps> {
    render() {
        const {...otherProps} = this.props;

        return (
            <ConfirmationModal
                title={i18n.t("legal.modal.title")}
                text={i18n.t("legal.modal.disclaimer")}
                justifyText
                buttons={[
                    {preset: "cancel"},
                    {
                        preset: "delete",
                        text: i18n.t("legal.decline"),
                        onPress: (hide) => {
                            hide();
                            rootNavigate("LoginRoot", {
                                screen: "LoginScreens",
                                params: {screen: "SigninScreen"},
                            });
                        },
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(TOSDeclinedModal);
