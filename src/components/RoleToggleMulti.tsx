import * as React from "react";
import i18n from "i18n-js";
import {Role, ROLES} from "../constants/profile-constants";
import {ButtonGroup, ButtonGroupProps, withTheme} from "react-native-elements";
import {getToggleStyleProps, ToggleStyleVariant} from "../styles/toggles";
import {ThemeProps} from "../types";

export type RoleToggleMultiProps = {
    roles: Role[];
    onSelect?: (roles: Role[]) => void;
    styleVariant?: ToggleStyleVariant;
} & Partial<ButtonGroupProps> &
    ThemeProps;

function RoleToggleMulti(props: RoleToggleMultiProps): JSX.Element {
    const {theme, roles, styleVariant, onSelect, ...otherProps} = props;
    const buttonLabels = ROLES.map((r: string) => i18n.t(`allRoles.${r}`));

    return (
        <ButtonGroup
            onPress={(idx: number) => {
                if (onSelect) {
                    const indices: number[] = typeof idx == "object" ? (idx as number[]) : [idx];
                    onSelect(indices.map((i: number) => ROLES[i]));
                }
            }}
            selectMultiple={true}
            selectedIndexes={roles.map((role: Role) => ROLES.indexOf(role))}
            buttons={buttonLabels}
            {...getToggleStyleProps(styleVariant, theme)}
            {...otherProps}
        />
    );
}

export default withTheme(RoleToggleMulti);
