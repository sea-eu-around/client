import React from "react";
import i18n from "i18n-js";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalClass} from "./ConfirmationModal";
import {MaterialIcons} from "@expo/vector-icons";
import {UserProfile} from "../../model/user-profile";
import store from "../../state/store";
import {setGroupMemberRole} from "../../state/groups/actions";
import {MyThunkDispatch} from "../../state/types";
import {GroupRole} from "../../api/dto";

export type GroupPromoteAdminModalProps = ThemeProps &
    Partial<CustomModalProps> & {groupId: string; profile: UserProfile};

export class GroupPromoteAdminModalClass extends React.Component<GroupPromoteAdminModalProps> {
    modalRef = React.createRef<ConfirmationModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {theme, groupId, profile, ...otherProps} = this.props;
        const dispatch = store.dispatch as MyThunkDispatch;

        return (
            <ConfirmationModal
                ref={this.modalRef}
                title={i18n.t("groups.promoteToAdmin.title")}
                text={i18n.t("groups.promoteToAdmin.text", {name: `${profile.firstName} ${profile.lastName}`})}
                justifyText
                icon={(props) => <MaterialIcons name="done" color={theme.okay} {...props} />}
                buttons={[
                    {preset: "cancel"},
                    {
                        preset: "confirm",
                        text: i18n.t("groups.promoteToAdmin.action"),
                        onPress: (hide) => {
                            dispatch(setGroupMemberRole(groupId, profile.id, GroupRole.Admin));
                            hide();
                        },
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(GroupPromoteAdminModalClass);
