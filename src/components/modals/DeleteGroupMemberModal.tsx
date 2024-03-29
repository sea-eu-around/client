import React from "react";
import i18n from "i18n-js";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {UserProfile} from "../../model/user-profile";
import {MyThunkDispatch} from "../../state/types";
import store from "../../state/store";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalClass} from "./ConfirmationModal";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {deleteGroupMember} from "../../state/groups/actions";

export type DeleteGroupMemberModalProps = ThemeProps &
    Partial<CustomModalProps> & {groupId: string; profile: UserProfile | null; pending?: boolean};

export class DeleteGroupMemberModalClass extends React.Component<DeleteGroupMemberModalProps> {
    modalRef = React.createRef<ConfirmationModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {theme, groupId, profile, pending, ...otherProps} = this.props;
        const dispatch = store.dispatch as MyThunkDispatch;

        const translationRoot = pending ? "groups.deletePendingMember" : "groups.deleteMember";

        return (
            <ConfirmationModal
                ref={this.modalRef}
                title={i18n.t(`${translationRoot}.title`)}
                text={
                    profile ? i18n.t(`${translationRoot}.text`, {name: `${profile.firstName} ${profile.lastName}`}) : ""
                }
                justifyText
                icon={(props) => <MaterialCommunityIcons name="account-remove" color={theme.error} {...props} />}
                buttons={[
                    {preset: "cancel"},
                    {
                        preset: "delete",
                        text: i18n.t(`${translationRoot}.action`),
                        // No need to hide the modal since it will be unmounted anyway
                        onPress: () => profile && dispatch(deleteGroupMember(groupId, profile.id, true)),
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(DeleteGroupMemberModalClass);
