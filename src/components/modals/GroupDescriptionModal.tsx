import React from "react";
import i18n from "i18n-js";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalClass} from "./ConfirmationModal";
import {Group} from "../../model/groups";
import {Text} from "react-native";

export type GroupDescriptionModalProps = ThemeProps &
    Partial<CustomModalProps> & {group: Group; onJoinGroup: () => void};

export class GroupDescriptionModalClass extends React.Component<GroupDescriptionModalProps> {
    modalRef = React.createRef<ConfirmationModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {theme, group, onJoinGroup, ...otherProps} = this.props;

        return (
            <ConfirmationModal
                ref={this.modalRef}
                title={group.name}
                text={group.description}
                additionalContent={(hide, textProps) => (
                    <>
                        {group.requiresApproval && (
                            <Text {...textProps}>{i18n.t("groups.create.requireApproval")}</Text>
                        )}
                    </>
                )}
                justifyText
                buttons={[
                    {preset: "cancel"},
                    {
                        backgroundColor: theme.accent,
                        text: i18n.t("groups.join"),
                        onPress: (hide) => {
                            hide();
                            onJoinGroup();
                        },
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(GroupDescriptionModalClass);
