import * as React from "react";
import {StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";

// Component props
type ButtonProps = {
    onPress?: () => void;
    text?: string;
    icon?: JSX.Element;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
} & ThemeProps;

class Button extends React.Component<ButtonProps> {
    render(): JSX.Element {
        const {onPress, text, icon, style, textStyle, children} = this.props;

        return (
            <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={text}
                onPress={onPress}
                style={[{flexDirection: "row", alignItems: "center"}, style]}
            >
                {children || (
                    <>
                        <Text style={textStyle}>{text}</Text>
                        {icon}
                    </>
                )}
            </TouchableOpacity>
        );
    }
}

export default withTheme(Button);
