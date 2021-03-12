import React from "react";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalButton, ConfirmationModalClass} from "./ConfirmationModal";
import {Group} from "../../model/groups";
import {Text, StyleSheet, TouchableOpacity} from "react-native";
import {ValidatedCheckBox} from "../ValidatedCheckBox";
import {preTheme} from "../../styles/utils";
import {getFormCheckBoxStyleProps} from "../../styles/forms";
import {GroupRole} from "../../api/dto";
import store from "../../state/store";
import {MyThunkDispatch} from "../../state/types";
import {updateGroup} from "../../state/groups/actions";

export type GroupSettingsModalProps = ThemeProps & Partial<CustomModalProps> & {group: Group};

export type GroupSettingsModalState = {visible: boolean; requiresApproval: boolean};

export class GroupSettingsModalClass extends React.Component<GroupSettingsModalProps, GroupSettingsModalState> {
    modalRef = React.createRef<ConfirmationModalClass>();

    constructor(props: GroupSettingsModalProps) {
        super(props);
        this.state = {visible: false, requiresApproval: false};
    }

    private setStateFromGroup(): void {
        const group = this.props.group;
        this.setState({visible: group.visible, requiresApproval: group.requiresApproval});
    }

    show(): void {
        this.setStateFromGroup();
        this.modalRef.current?.show();
    }

    componentDidUpdate(oldProps: GroupSettingsModalProps): void {
        const group = this.props.group;
        if (group.id !== oldProps.group.id) this.setStateFromGroup();
    }

    render(): JSX.Element {
        const {theme, group, ...otherProps} = this.props;
        const styles = themedStyles(theme);
        const dispatch = store.dispatch as MyThunkDispatch;

        const checkboxProps = getFormCheckBoxStyleProps(theme);

        const buttons: ConfirmationModalButton[] = [];

        if (group.myRole === GroupRole.Admin) {
            buttons.push({preset: "cancel"});
            buttons.push({
                backgroundColor: theme.accent,
                text: i18n.t("apply"),
                onPress: (hide) => {
                    hide();
                    dispatch(
                        updateGroup(group.id, {
                            visible: this.state.visible,
                            requiresApproval: this.state.requiresApproval,
                        }),
                    );
                },
            });
        } else {
            buttons.push({preset: "cancel", text: i18n.t("ok")});
        }

        return (
            <ConfirmationModal
                ref={this.modalRef}
                title={i18n.t("groups.settings.title")}
                additionalContent={() => (
                    <>
                        <TouchableOpacity
                            onPress={() => this.setState({visible: !this.state.visible})}
                            activeOpacity={0.75}
                        >
                            <ValidatedCheckBox
                                value={this.state.visible}
                                label={i18n.t("groups.create.visible")}
                                onPress={() => this.setState({visible: !this.state.visible})}
                                {...checkboxProps}
                            />
                            <Text style={styles.fieldDescription}>{i18n.t("groups.create.visibleDescription")}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.setState({requiresApproval: !this.state.requiresApproval})}
                            activeOpacity={0.75}
                        >
                            <ValidatedCheckBox
                                value={this.state.requiresApproval}
                                label={i18n.t("groups.create.requireApproval")}
                                onPress={() => this.setState({requiresApproval: !this.state.requiresApproval})}
                                {...checkboxProps}
                            />
                            <Text style={styles.fieldDescription}>
                                {i18n.t("groups.create.requireApprovalDescription")}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
                justifyText
                buttons={buttons}
                {...otherProps}
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        fieldDescription: {
            color: theme.textLight,
            fontSize: 14,
            marginBottom: 20,
        },
    });
});

export default withTheme(GroupSettingsModalClass);
