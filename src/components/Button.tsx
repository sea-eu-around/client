import * as React from "react";
import {StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";

const SKINS = {
    "rounded-filled": (theme: Theme) => ({
        button: {
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: 48,
            marginVertical: 10,
            borderRadius: 100,
            backgroundColor: theme.accent,
        },
        text: {
            fontSize: 18,
            letterSpacing: 1,
            color: theme.textWhite,
        },
    }),
    "rounded-hollow": (theme: Theme) => ({
        button: {
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: 48,
            marginVertical: 10,
            borderRadius: 100,
            borderColor: theme.accent,
            borderWidth: 1,
        },
        text: {
            fontSize: 18,
            letterSpacing: 1,
            color: theme.accent,
        },
    }),
};

export type ButtonSkin = keyof typeof SKINS;

// Component props
type ButtonProps = {
    onPress?: () => void;
    text?: string;
    icon?: JSX.Element;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    skin?: ButtonSkin;
} & ThemeProps;

class Button extends React.Component<ButtonProps> {
    render(): JSX.Element {
        const {onPress, text, icon, skin, style, textStyle, children, theme} = this.props;

        const skinStyles = skin ? SKINS[skin](theme) : {button: {}, text: {}};

        return (
            <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={text}
                onPress={onPress}
                style={[{flexDirection: "row", alignItems: "center"}, skinStyles.button, style]}
            >
                {children || (
                    <>
                        <Text style={[skinStyles.text, textStyle]}>{text}</Text>
                        {icon}
                    </>
                )}
            </TouchableOpacity>
        );
    }
}

export default withTheme(Button);
