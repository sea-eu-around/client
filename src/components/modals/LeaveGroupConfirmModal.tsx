import React from "react";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalClass} from "./ConfirmationModal";
import {MaterialIcons} from "@expo/vector-icons";
import i18n from "i18n-js";
import store from "../../state/store";
import {leaveGroup} from "../../state/groups/actions";
import {MyThunkDispatch} from "../../state/types";

export type LeaveGroupConfirmModalProps = ThemeProps & Partial<CustomModalProps> & {groupId: string};

export class LeaveGroupConfirmModalClass extends React.Component<LeaveGroupConfirmModalProps> {
    private modalRef = React.createRef<ConfirmationModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {groupId, theme, ...otherProps} = this.props;
        const dispatch = store.dispatch as MyThunkDispatch;

        return (
            <ConfirmationModal
                ref={this.modalRef}
                title={i18n.t("groups.leave.title")}
                text={i18n.t("groups.leave.text")}
                icon={(props) => <MaterialIcons name="exit-to-app" color={theme.text} {...props} />}
                buttons={[
                    {preset: "cancel"},
                    {
                        text: i18n.t("ok"),
                        preset: "delete",
                        onPress: async (hide) => {
                            const success = await dispatch(leaveGroup(groupId));
                            if (success) hide();
                        },
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(LeaveGroupConfirmModalClass);
