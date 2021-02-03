import * as React from "react";
import {StyleProp, ViewStyle, StyleSheet} from "react-native";
import i18n from "i18n-js";
import {StaffRole, STAFF_ROLES, STAFF_ROLE_ICONS} from "../constants/profile-constants";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import PopUpSelector from "./PopUpSelector";
import {preTheme} from "../styles/utils";
import {MaterialIcons} from "@expo/vector-icons";
import {PickerButtonStyleVariant} from "../styles/picker";

// Component props
export type StaffRoleToggleProps = {
    staffRoles: StaffRole[];
    onChange?: (staffRoles: StaffRole[]) => void;
    buttonStyle?: StyleProp<ViewStyle>;
    buttonStyleVariant?: PickerButtonStyleVariant;
    multiple?: boolean;
    atLeastOne?: boolean;
    noOkUnderline?: boolean;
};

function StaffRolePicker(props: StaffRoleToggleProps & ThemeProps): JSX.Element {
    const {staffRoles, multiple, atLeastOne, noOkUnderline, buttonStyle, buttonStyleVariant, onChange, theme} = props;
    const styles = themedStyles(theme);

    return (
        <PopUpSelector
            values={STAFF_ROLES}
            label={(r: string) => i18n.t(`staffRoles.${r}`)}
            placeholder={i18n.t(`picker.callToAction`).replace("%d", staffRoles.length + "")}
            icon={(_, i: number) => <MaterialIcons name={STAFF_ROLE_ICONS[i]} style={styles.icon} />}
            selected={staffRoles}
            buttonStyle={buttonStyle}
            buttonStyleVariant={buttonStyleVariant}
            onSelect={(values: string[]) => {
                if (onChange) onChange(values as StaffRole[]);
            }}
            multiple={multiple}
            atLeastOne={atLeastOne}
            noOkUnderline={noOkUnderline}
        />
    );
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        icon: {
            fontSize: 20,
            marginRight: 6,
        },
    });
});

export default withTheme(StaffRolePicker);
