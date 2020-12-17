import * as React from "react";
import {Text, TextProps, View, ViewStyle} from "react-native";
import {Flag} from "react-native-country-picker-modal";
import i18n from "i18n-js";
import {University} from "../constants/universities";

// Component props
export type FormattedUniversityProps = {
    university: University | null;
    containerStyle?: ViewStyle;
    flagSize?: number;
    flagEmoji?: boolean;
} & TextProps;

export default class FormattedUniversity extends React.Component<FormattedUniversityProps> {
    render(): JSX.Element {
        const {university, containerStyle, flagSize, flagEmoji, ...otherProps} = this.props;

        return (
            <View style={[{flexDirection: "row"}, containerStyle]}>
                {university && (
                    <>
                        <Flag
                            countryCode={university.country}
                            flagSize={flagSize || 18}
                            withEmoji={flagEmoji || false}
                        />
                        <Text {...otherProps} style={[{marginLeft: -5}, otherProps.style]}>
                            {i18n.t(`universities.${university.key}`)}
                        </Text>
                    </>
                )}
            </View>
        );
    }
}
