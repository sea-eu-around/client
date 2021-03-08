import React from "react";
import i18n from "i18n-js";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalClass} from "./ConfirmationModal";
import {Group} from "../../model/groups";
import store from "../../state/store";
import {MyThunkDispatch} from "../../state/types";
import {deleteGroupMember, setGroupMemberStatus} from "../../state/groups/actions";
import {GroupMemberStatus} from "../../api/dto";
import {Text} from "react-native";

export type GroupInviteResponseModalProps = ThemeProps & Partial<CustomModalProps> & {group: Group};

export class GroupInviteResponseModalClass extends React.Component<GroupInviteResponseModalProps> {
    modalRef = React.createRef<ConfirmationModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {group, ...otherProps} = this.props;
        const dispatch = store.dispatch as MyThunkDispatch;

        const stillNeedsApproval = group.requiresApproval && group.myStatus !== GroupMemberStatus.InvitedByAdmin;
        const descriptionText = group.description.length > 0 ? group.description : i18n.t("groups.description.none");

        return (
            <ConfirmationModal
                ref={this.modalRef}
                title={group.name}
                text={descriptionText}
                justifyText
                {...(stillNeedsApproval
                    ? {
                          additionalContent: (hide, textProps) => (
                              <Text {...textProps} style={[textProps.style, {fontSize: 14}]}>
                                  {i18n.t("groups.invite.approvalDisclaimerInvitee")}
                              </Text>
                          ),
                      }
                    : {})}
                buttons={[
                    {
                        preset: "delete",
                        text: i18n.t("groups.invite.decline"),
                        onPress: (hide) => {
                            const localUser = store.getState().profile.user;
                            if (localUser) dispatch(deleteGroupMember(group.id, localUser.id, false));
                            hide();
                        },
                    },
                    {
                        preset: "confirm",
                        text: i18n.t("groups.invite.accept"),
                        onPress: (hide) => {
                            const localUser = store.getState().profile.user;
                            if (localUser) {
                                if (stillNeedsApproval)
                                    dispatch(setGroupMemberStatus(group.id, localUser.id, GroupMemberStatus.Pending));
                                else dispatch(setGroupMemberStatus(group.id, localUser.id, GroupMemberStatus.Approved));
                            }

                            hide();
                        },
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(GroupInviteResponseModalClass);
