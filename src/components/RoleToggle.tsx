import * as React from "react";

import i18n from "i18n-js";
import {Role, ROLES} from "../constants/profile-constants";
import {ButtonGroup} from "react-native-elements";

export type RoleToggleProps = {
    role: Role;
    onSelect?: (role: Role) => void;
};

export function RoleToggle(props: RoleToggleProps): JSX.Element {
    const buttonLabels = ROLES.map((r: string) => i18n.t(`roles.${r}`));
    const {role} = props;

    return (
        <ButtonGroup
            onPress={(idx: number) => {
                if (props.onSelect) props.onSelect(ROLES[idx]);
            }}
            selectedIndex={ROLES.indexOf(role)}
            buttons={buttonLabels}
            containerStyle={{height: 35, marginLeft: 0, marginRight: 0}}
        />
    );
}
