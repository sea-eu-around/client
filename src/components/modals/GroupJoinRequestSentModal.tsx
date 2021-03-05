import React from "react";
import i18n from "i18n-js";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalClass} from "./ConfirmationModal";
import {MaterialIcons} from "@expo/vector-icons";

export type GroupJoinRequestSentModalProps = ThemeProps & Partial<CustomModalProps>;

export class GroupJoinRequestSentModalClass extends React.Component<GroupJoinRequestSentModalProps> {
    modalRef = React.createRef<ConfirmationModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {theme, ...otherProps} = this.props;

        return (
            <ConfirmationModal
                ref={this.modalRef}
                title={i18n.t("groups.joinRequestSent.title")}
                text={i18n.t("groups.joinRequestSent.text")}
                justifyText
                icon={(props) => <MaterialIcons name="done" color={theme.okay} {...props} />}
                buttons={[{preset: "confirm"}]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(GroupJoinRequestSentModalClass);
