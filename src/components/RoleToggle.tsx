import * as React from "react";

import {Text, View} from "react-native";
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

    const onUpdate = (idx: number) => {
        if (props.onSelect) props.onSelect(ROLES[idx]);
    };

    return (
        <View style={{width: "100%"}}>
            <Text>{i18n.t("role")}</Text>
            <ButtonGroup
                onPress={onUpdate}
                selectedIndex={ROLES.indexOf(role)}
                buttons={buttonLabels}
                containerStyle={{height: 40, marginLeft: 0, marginRight: 0}}
            />
        </View>
    );
}
