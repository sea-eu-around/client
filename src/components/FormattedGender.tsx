import * as React from "react";
import {StyleProp, Text, TextProps, TextStyle, View, ViewStyle} from "react-native";
import i18n from "i18n-js";
import {Gender} from "../constants/profile-constants";
import {FontAwesome} from "@expo/vector-icons";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";

// Component props
export type FormattedGenderProps = {
    gender: Gender;
    containerStyle?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<TextStyle>;
} & TextProps &
    ThemeProps;

class FormattedGender extends React.Component<FormattedGenderProps> {
    render(): JSX.Element {
        const {gender, containerStyle, iconStyle, theme, ...otherProps} = this.props;

        const icon = gender === "female" ? "female" : gender === "male" ? "male" : undefined;
        return (
            <View style={[{flexDirection: "row", alignItems: "center"}, containerStyle]}>
                {icon && <FontAwesome name={icon} size={24} color={theme.textLight} style={iconStyle} />}
                <Text {...otherProps} style={[{marginLeft: icon ? 10 : 0}, otherProps.style]}>
                    {i18n.t(`genders.${gender}`)}
                </Text>
            </View>
        );
    }
}

export default withTheme(FormattedGender);
