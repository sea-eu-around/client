import * as React from "react";
import {StyleProp, ViewStyle, StyleSheet} from "react-native";
import i18n from "i18n-js";
import {StaffRole, STAFF_ROLES, STAFF_ROLE_ICONS} from "../constants/profile-constants";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import PopUpSelector from "./PopUpSelector";
import {preTheme} from "../styles/utils";
import {MaterialIcons} from "@expo/vector-icons";

// Component props
export type StaffRoleToggleProps = {
    staffRoles: StaffRole[];
    onChange?: (staffRoles: StaffRole[]) => void;
    buttonStyle?: StyleProp<ViewStyle>;
    multiple?: boolean;
    atLeastOne?: boolean;
};

function StaffRolePicker(props: StaffRoleToggleProps & ThemeProps): JSX.Element {
    const {staffRoles, multiple, atLeastOne, buttonStyle, onChange, theme} = props;
    const styles = themedStyles(theme);

    return (
        <PopUpSelector
            values={STAFF_ROLES}
            label={(r: string) => i18n.t(`staffRoles.${r}`)}
            icon={(_, i: number) => <MaterialIcons name={STAFF_ROLE_ICONS[i]} style={styles.icon} />}
            selected={staffRoles}
            valueStyle={styles.value}
            buttonStyle={[styles.button, buttonStyle]}
            onSelect={(values: string[]) => {
                if (onChange) onChange(values as StaffRole[]);
            }}
            multiple={multiple}
            atLeastOne={atLeastOne}
        />
    );
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        button: {
            height: 40,
            alignItems: "center",
        },
        value: {
            letterSpacing: 0.5,
            fontSize: 16,
            color: theme.text,
        },
        icon: {
            fontSize: 20,
            marginRight: 6,
        },
    });
});

export default withTheme(StaffRolePicker);
