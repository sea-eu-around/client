import * as React from "react";
import {View} from "react-native";
import i18n from "i18n-js";
import {StaffRole, STAFF_ROLES} from "../constants/profile-constants";
import {Picker} from "react-native";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";

// Component props
export type StaffRoleToggleProps = {
    staffRole: StaffRole | null;
    onSelect?: (staffRole: StaffRole) => void;
};

function StaffRoleToggle(props: StaffRoleToggleProps & ThemeProps): JSX.Element {
    const {staffRole} = props;

    const onSelect = (value: string) => {
        if (props.onSelect) props.onSelect(value as StaffRole);
    };

    const pickerItems = STAFF_ROLES.map((r) => <Picker.Item key={r} label={i18n.t(`staffRoles.${r}`)} value={r} />);

    return (
        <View style={{width: "100%"}}>
            <Picker selectedValue={staffRole} onValueChange={onSelect}>
                {pickerItems}
            </Picker>
        </View>
    );
}

export default withTheme(StaffRoleToggle);
