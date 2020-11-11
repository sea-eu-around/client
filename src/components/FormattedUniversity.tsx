import * as React from "react";
import {Text, TextProps, View, ViewStyle} from "react-native";
import {Flag} from "react-native-country-picker-modal";
import i18n from "i18n-js";
import {University} from "../constants/universities";

// Component props
export type FormattedUniversityProps = {
    university: University | null;
    containerStyle: ViewStyle;
} & TextProps;

export class FormattedUniversity extends React.Component<FormattedUniversityProps> {
    render(): JSX.Element {
        const {university, ...otherProps} = this.props;

        return (
            <View style={[{flexDirection: "row"}, this.props.containerStyle]}>
                {university && (
                    <>
                        <Flag countryCode={university.country} flagSize={18} withEmoji={false}></Flag>
                        <Text {...otherProps}>{i18n.t(`universities.${university.key}`)}</Text>
                    </>
                )}
            </View>
        );
    }
}
