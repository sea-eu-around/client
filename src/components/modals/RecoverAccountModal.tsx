import React from "react";
import i18n from "i18n-js";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import store from "../../state/store";
import {cancelLoginRecovery, requestLogin} from "../../state/auth/actions";
import {MyThunkDispatch} from "../../state/types";
import ConfirmationModal from "./ConfirmationModal";

export type RecoverAccountModalProps = ThemeProps & Partial<CustomModalProps> & {email: string; password: string};

class RecoverAccountModal extends React.Component<RecoverAccountModalProps> {
    render() {
        const {email, password, ...otherProps} = this.props;

        return (
            <ConfirmationModal
                title={i18n.t("recoverAccount.title")}
                text={i18n.t("recoverAccount.text")}
                justifyText
                buttons={[
                    {preset: "cancel", onPress: () => store.dispatch(cancelLoginRecovery())},
                    {
                        preset: "confirm",
                        text: i18n.t("recoverAccount.yes"),
                        onPress: () => (store.dispatch as MyThunkDispatch)(requestLogin(email, password, true)),
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(RecoverAccountModal);
