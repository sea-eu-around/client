import * as React from "react";
import i18n from "i18n-js";
import {Degree, DEGREES} from "../constants/profile-constants";
import {ButtonGroup, ButtonGroupProps, withTheme} from "react-native-elements";
import {getToggleStyleProps, ToggleStyleVariant} from "../styles/toggles";
import {ThemeProps} from "../types";
import {ViewStyle} from "react-native";

export type GenderToggleMultiProps = {
    degrees: Degree[];
    onSelect?: (degrees: Degree[]) => void;
    styleVariant?: ToggleStyleVariant;
    style?: ViewStyle;
} & Partial<ButtonGroupProps> &
    ThemeProps;

function DegreeToggleMulti(props: GenderToggleMultiProps): JSX.Element {
    const buttonLabels = DEGREES.map((r: string) => i18n.t(`degrees.${r}`));
    const {theme, style, degrees, styleVariant, onSelect, ...otherProps} = props;

    const styleProps = getToggleStyleProps(styleVariant, theme);

    return (
        <ButtonGroup
            onPress={(idx: number) => {
                if (onSelect) {
                    const indices: number[] = typeof idx == "object" ? (idx as number[]) : [idx];
                    onSelect(indices.map((i: number) => DEGREES[i]));
                }
            }}
            selectMultiple={true}
            selectedIndexes={degrees.map((degree: Degree) => DEGREES.indexOf(degree))}
            buttons={buttonLabels}
            {...styleProps}
            containerStyle={[styleProps.containerStyle, style]}
            {...otherProps}
        />
    );
}

export default withTheme(DegreeToggleMulti);
