import * as React from "react";
import {ButtonGroup} from "react-native-elements";
import i18n from "i18n-js";
import {Degree, DEGREES} from "../constants/profile-constants";
import {ViewStyle} from "react-native";

export type DegreeToggleProps = {
    degree?: Degree;
    onUpdate?: (degree?: Degree) => void;
    style?: ViewStyle;
};

class DegreeToggle extends React.Component<DegreeToggleProps> {
    render(): JSX.Element {
        const buttonLabels = DEGREES.map((d: string) => i18n.t(`degrees.${d}`));
        const {degree, style} = this.props;

        return (
            <ButtonGroup
                onPress={(idx: number) => {
                    if (this.props.onUpdate) this.props.onUpdate(idx == -1 ? undefined : DEGREES[idx]);
                }}
                selectedIndex={degree ? DEGREES.indexOf(degree) : -1}
                buttons={buttonLabels}
                containerStyle={[{height: 35, marginLeft: 0, marginRight: 0}, style]}
            />
        );
    }
}

export default DegreeToggle;
