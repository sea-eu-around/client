import * as React from "react";
import {StyleSheet} from "react-native";
import i18n from "i18n-js";
import {Role, ROLES} from "../constants/profile-constants";
import {ButtonGroup, ButtonGroupProps, withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {ThemeProps} from "../types";
import {getToggleStyleProps} from "../styles/toggles";

export type RoleToggleProps = {
    role: Role;
    onSelect?: (role: Role) => void;
} & Partial<ButtonGroupProps> &
    ThemeProps;

function RoleToggle(props: RoleToggleProps): JSX.Element {
    const {role, onSelect, theme, ...otherProps} = props;
    const styles = themedStyles(theme);
    const styleProps = getToggleStyleProps(false, theme);

    const buttonLabels = ROLES.map((r: string) => i18n.t(`allRoles.${r}`));

    return (
        <ButtonGroup
            onPress={(idx: number) => {
                if (onSelect) onSelect(ROLES[idx]);
            }}
            selectedIndex={ROLES.indexOf(role)}
            buttons={buttonLabels}
            containerStyle={styles.container}
            {...styleProps}
            {...otherProps}
        />
    );
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        container: {
            height: 35,
            marginLeft: 0,
            marginRight: 0,
        },
    });
});

export default withTheme(RoleToggle);
