import * as React from "react";
import {ButtonGroup, withTheme} from "react-native-elements";
import i18n from "i18n-js";
import {Degree, DEGREES} from "../constants/profile-constants";
import {ThemeProps} from "../types";
import {getToggleStyleProps, ToggleStyleVariant} from "../styles/toggles";

export type DegreeToggleProps = {
    degree?: Degree;
    onUpdate?: (degree?: Degree) => void;
    styleVariant?: ToggleStyleVariant;
} & ThemeProps;

class DegreeToggle extends React.Component<DegreeToggleProps> {
    render(): JSX.Element {
        const buttonLabels = DEGREES.map((d: string) => i18n.t(`degrees.${d}`));
        const {degree, theme, styleVariant} = this.props;

        return (
            <ButtonGroup
                onPress={(idx: number) => {
                    if (this.props.onUpdate) this.props.onUpdate(idx == -1 ? undefined : DEGREES[idx]);
                }}
                selectedIndex={degree ? DEGREES.indexOf(degree) : -1}
                buttons={buttonLabels}
                {...getToggleStyleProps(styleVariant, theme)}
            />
        );
    }
}

export default withTheme(DegreeToggle);
