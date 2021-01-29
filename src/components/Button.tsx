import * as React from "react";
import {StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";

export type ButtonSkinStyle = {button: ViewStyle; text: TextStyle};

export const BUTTON_SKINS = {
    "rounded-filled": (theme: Theme): ButtonSkinStyle => ({
        button: {
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: 48,
            marginVertical: 10,
            borderRadius: 100,
            backgroundColor: theme.accent,
            paddingHorizontal: 10,
        },
        text: {
            fontSize: 18,
            letterSpacing: 1,
            color: theme.textWhite,
        },
    }),
    "rounded-hollow": (theme: Theme): ButtonSkinStyle => ({
        button: {
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: 48,
            marginVertical: 10,
            borderRadius: 100,
            borderColor: theme.accent,
            borderWidth: 1,
            paddingHorizontal: 10,
        },
        text: {
            fontSize: 18,
            letterSpacing: 1,
            color: theme.accent,
        },
    }),
};

export type ButtonSkin = keyof typeof BUTTON_SKINS;

// Component props
export type ButtonProps = {
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

        const skinStyles = skin ? BUTTON_SKINS[skin](theme) : {button: {}, text: {}};

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
