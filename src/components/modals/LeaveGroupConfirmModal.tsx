import React from "react";
import {ThemeProps} from "../../types";
import {CheckBox, withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalClass} from "./ConfirmationModal";
import {MaterialIcons} from "@expo/vector-icons";
import i18n from "i18n-js";
import store from "../../state/store";
import {leaveGroup} from "../../state/groups/actions";
import {MyThunkDispatch} from "../../state/types";
import {Text, TouchableOpacity, StyleSheet} from "react-native";
import {preTheme} from "../../styles/utils";

export type LeaveGroupConfirmModalProps = ThemeProps & Partial<CustomModalProps> & {groupId: string};

export type LeaveGroupConfirmModalState = {deleteData: boolean};

export class LeaveGroupConfirmModalClass extends React.Component<
    LeaveGroupConfirmModalProps,
    LeaveGroupConfirmModalState
> {
    private modalRef = React.createRef<ConfirmationModalClass>();

    constructor(props: LeaveGroupConfirmModalProps) {
        super(props);
        this.state = {deleteData: false};
    }

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {groupId, theme, ...otherProps} = this.props;
        const {deleteData} = this.state;
        const styles = themedStyles(theme);
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
                            const success = await dispatch(leaveGroup(groupId, deleteData));
                            if (success) hide();
                        },
                    },
                ]}
                additionalContent={(hide, textProps) => (
                    <TouchableOpacity
                        style={styles.checkboxTouchable}
                        onPress={() => this.setState({...this.state, deleteData: !deleteData})}
                    >
                        <CheckBox
                            containerStyle={styles.checkboxContainer}
                            checked={deleteData}
                            onPress={() => this.setState({...this.state, deleteData: !deleteData})}
                        />
                        <Text {...textProps} style={[textProps.style, {fontSize: 14, flex: 1}]}>
                            {i18n.t("groups.leave.deleteData")}
                        </Text>
                    </TouchableOpacity>
                )}
                {...otherProps}
            />
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        checkboxTouchable: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
        },
        checkboxContainer: {
            padding: 0,
            marginLeft: 0,
            marginRight: 5,
        },
    });
});

export default withTheme(LeaveGroupConfirmModalClass);
