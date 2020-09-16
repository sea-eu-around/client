import * as React from "react";

import {Text, View} from "react-native";
import i18n from "i18n-js";
import {Role, ROLES, StaffRole, STAFF_ROLES} from "../constants/profile-constants";
import {ButtonGroup} from "react-native-elements";
import {Picker} from "react-native";

export type StaffRoleToggleProps = {
    staffRole: StaffRole | null;
    onSelect?: (staffRole: StaffRole) => void;
};

export function StaffRoleToggle(props: StaffRoleToggleProps): JSX.Element {
    const {staffRole} = props;

    const onSelect = (value: string) => {
        if (props.onSelect) props.onSelect(value as StaffRole);
    };

    const pickerItems = STAFF_ROLES.map((r) => {
        return <Picker.Item key={r} label={i18n.t(`staffRoles.${r}`)} value={r} />
    });

    return (
        <View style={{width: "100%"}}>
            <Picker selectedValue={staffRole} onValueChange={onSelect}>
                {pickerItems}
            </Picker>
        </View>
    );
}

/*
export function StaffRoleToggle(props: StaffRoleToggleProps): JSX.Element {
    const buttonLabels = STAFF_ROLES.map((r: string) => i18n.t(`staffRoles.${r}`));
    const {staffRole} = props;

    const onUpdate = (idx: number) => {
        if (props.onSelect) props.onSelect(STAFF_ROLES[idx]);
    };

    return (
        <View style={{width: "100%"}}>
            <ButtonGroup
                onPress={onUpdate}
                selectedIndex={STAFF_ROLES.indexOf(staffRole)}
                buttons={buttonLabels}
                containerStyle={{height: 40, marginLeft: 0, marginRight: 0}}
            />
        </View>
    );
}
*/
