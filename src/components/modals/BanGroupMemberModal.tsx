import React from "react";
import i18n from "i18n-js";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {UserProfile} from "../../model/user-profile";
import {MyThunkDispatch} from "../../state/types";
import store from "../../state/store";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalClass} from "./ConfirmationModal";
import {MaterialIcons} from "@expo/vector-icons";
import {setGroupMemberStatus} from "../../state/groups/actions";
import {GroupMemberStatus} from "../../api/dto";

export type BanGroupMemberModalProps = ThemeProps &
    Partial<CustomModalProps> & {groupId: string; profile: UserProfile | null; pending?: boolean};

export class BanGroupMemberModalClass extends React.Component<BanGroupMemberModalProps> {
    modalRef = React.createRef<ConfirmationModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {theme, groupId, profile, pending, ...otherProps} = this.props;
        const dispatch = store.dispatch as MyThunkDispatch;

        const translationRoot = pending ? "groups.banPendingMember" : "groups.banMember";

        return (
            <ConfirmationModal
                ref={this.modalRef}
                title={i18n.t(`${translationRoot}.title`)}
                text={
                    profile ? i18n.t(`${translationRoot}.text`, {name: `${profile.firstName} ${profile.lastName}`}) : ""
                }
                icon={(props) => <MaterialIcons name="block" color={theme.error} {...props} />}
                buttons={[
                    {preset: "cancel"},
                    {
                        preset: "delete",
                        text: i18n.t(`${translationRoot}.action`),
                        onPress: async (hide) => {
                            if (profile) {
                                const success = await dispatch(
                                    setGroupMemberStatus(groupId, profile.id, GroupMemberStatus.Banned),
                                );
                                if (success) hide();
                            }
                        },
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(BanGroupMemberModalClass);
