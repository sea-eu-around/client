import React from "react";
import i18n from "i18n-js";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalClass} from "./ConfirmationModal";
import {MaterialIcons} from "@expo/vector-icons";
import {Group} from "../../model/groups";
import {navigateToGroup} from "../../navigation/utils";

export type GroupJoinedModalProps = ThemeProps & Partial<CustomModalProps> & {group: Group};

export class GroupJoinedModalClass extends React.Component<GroupJoinedModalProps> {
    modalRef = React.createRef<ConfirmationModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {theme, group, ...otherProps} = this.props;

        return (
            <ConfirmationModal
                ref={this.modalRef}
                title={i18n.t("groups.groupJoined.title")}
                text={i18n.t("groups.groupJoined.text", {name: group.name})}
                justifyText
                icon={(props) => <MaterialIcons name="done" color={theme.okay} {...props} />}
                buttons={[
                    {preset: "confirm"},
                    {
                        backgroundColor: theme.accent,
                        text: i18n.t("groups.groupJoined.viewGroup"),
                        onPress: (hide) => {
                            hide();
                            navigateToGroup(group.id);
                        },
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(GroupJoinedModalClass);
