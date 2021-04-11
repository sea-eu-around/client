import React from "react";
import i18n from "i18n-js";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalClass} from "./ConfirmationModal";
import store from "../../state/store";
import {MyThunkDispatch} from "../../state/types";
import {inviteToGroup} from "../../state/groups/actions";
import {GroupRole} from "../../api/dto";
import {Text} from "react-native";
import {UserProfile} from "../../model/user-profile";
import {Group} from "../../model/groups";

export type GroupInviteModalProps = ThemeProps & Partial<CustomModalProps> & {group: Group; profile: UserProfile};

export class GroupInviteModalClass extends React.Component<GroupInviteModalProps> {
    modalRef = React.createRef<ConfirmationModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {group, profile, ...otherProps} = this.props;
        const dispatch = store.dispatch as MyThunkDispatch;

        const adminView = group.myRole === GroupRole.Admin;
        const stillNeedsApproval = group.requiresApproval && !adminView;

        return (
            <ConfirmationModal
                ref={this.modalRef}
                title={i18n.t("groups.invite.title")}
                text={i18n.t("groups.invite.text", {name: `${profile.firstName}`})}
                justifyText
                {...(stillNeedsApproval
                    ? {
                          additionalContent: (hide, textProps) => (
                              <Text {...textProps} style={[textProps.style, {fontSize: 14}]}>
                                  {i18n.t("groups.invite.approvalDisclaimerInviter", {name: `${profile.firstName}`})}
                              </Text>
                          ),
                      }
                    : {})}
                buttons={[
                    {preset: "cancel"},
                    {
                        preset: "confirm",
                        text: i18n.t("groups.invite.invite"),
                        onPress: (hide) => {
                            dispatch(inviteToGroup(group.id, profile));
                            hide();
                        },
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(GroupInviteModalClass);
