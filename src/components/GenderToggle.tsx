import * as React from "react";
import i18n from "i18n-js";
import {Gender, GENDERS} from "../constants/profile-constants";
import {ButtonGroup, withTheme} from "react-native-elements";
import {ThemeProps} from "../types";
import {getToggleStyleProps, ToggleStyleVariant} from "../styles/toggles";

// Component props
export type GenderToggleProps = {
    gender?: Gender | null;
    onSelect?: (gender: Gender) => void;
    disabled?: boolean;
    styleVariant?: ToggleStyleVariant;
};

function GenderToggle(props: GenderToggleProps & ThemeProps): JSX.Element {
    const buttonLabels = GENDERS.map((r: string) => i18n.t(`genders.${r}`));
    const {gender, disabled, styleVariant, theme} = props;

    const onUpdate = (idx: number) => {
        if (props.onSelect) props.onSelect(GENDERS[idx]);
    };

    return (
        <ButtonGroup
            onPress={onUpdate}
            selectedIndex={gender !== undefined && gender !== null ? GENDERS.indexOf(gender) : -1}
            buttons={buttonLabels}
            disabled={disabled}
            {...getToggleStyleProps(styleVariant, theme)}
        />
    );
}

export default withTheme(GenderToggle);
