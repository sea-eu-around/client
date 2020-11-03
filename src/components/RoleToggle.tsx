import * as React from "react";

import i18n from "i18n-js";
import {Role, ROLES} from "../constants/profile-constants";
import {ButtonGroup, ButtonGroupProps} from "react-native-elements";

export type RoleToggleProps = {
    role: Role;
    onSelect?: (role: Role) => void;
} & Partial<ButtonGroupProps>;

export function RoleToggle(props: RoleToggleProps): JSX.Element {
    const buttonLabels = ROLES.map((r: string) => i18n.t(`roles.${r}`));
    const {role, onSelect, ...otherProps} = props;

    return (
        <ButtonGroup
            onPress={(idx: number) => {
                if (onSelect) onSelect(ROLES[idx]);
            }}
            selectedIndex={ROLES.indexOf(role)}
            buttons={buttonLabels}
            containerStyle={{height: 35, marginLeft: 0, marginRight: 0}}
            {...otherProps}
        />
    );
}
