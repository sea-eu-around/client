import * as React from "react";
import i18n from "i18n-js";
import {Gender, GENDERS} from "../constants/profile-constants";
import {ButtonGroup, ButtonGroupProps, withTheme} from "react-native-elements";
import {getToggleStyleProps, ToggleStyleVariant} from "../styles/toggles";
import {ThemeProps} from "../types";

export type GenderToggleMultiProps = {
    genders: Gender[];
    onSelect?: (genders: Gender[]) => void;
    styleVariant?: ToggleStyleVariant;
} & Partial<ButtonGroupProps> &
    ThemeProps;

function GenderToggleMulti(props: GenderToggleMultiProps): JSX.Element {
    const buttonLabels = GENDERS.map((r: string) => i18n.t(`genders.${r}`));
    const {theme, genders, styleVariant, onSelect, ...otherProps} = props;

    return (
        <ButtonGroup
            onPress={(idx: number) => {
                if (onSelect) {
                    const indices: number[] = typeof idx == "object" ? (idx as number[]) : [idx];
                    onSelect(indices.map((i: number) => GENDERS[i]));
                }
            }}
            selectMultiple={true}
            selectedIndexes={genders.map((gender: Gender) => GENDERS.indexOf(gender))}
            buttons={buttonLabels}
            {...getToggleStyleProps(styleVariant, theme)}
            {...otherProps}
        />
    );
}

export default withTheme(GenderToggleMulti);
