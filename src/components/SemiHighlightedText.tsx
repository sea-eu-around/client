import * as React from "react";
import {StyleProp, Text, TextStyle, View, ViewStyle, StyleSheet} from "react-native";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";

// Component props
export type SemiHighlightedTextProps = {
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    text: string;
    fontSize?: number;
} & ThemeProps;

class SemiHighlightedText extends React.Component<SemiHighlightedTextProps> {
    render(): JSX.Element {
        const {theme, text, containerStyle, textStyle} = this.props;
        const styles = themedStyles(theme);

        const fontSize = this.props.fontSize || 24;
        const underlineHeight = fontSize * 0.55;
        const underlineBottom = -1;
        const underlineSides = fontSize * 0.4;

        return (
            <View style={[styles.textContainer, containerStyle]}>
                <View style={[styles.underline, {height: underlineHeight, bottom: underlineBottom}]} />
                <Text style={[styles.text, textStyle, {fontSize, paddingHorizontal: underlineSides}]}>{text}</Text>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        textContainer: {
            alignItems: "center",
        },
        text: {
            fontFamily: "RalewaySemiBold",
            color: theme.accent,
            zIndex: 2,

            // Make it more readable with the dark theme
            ...(theme.id === "dark"
                ? {
                      textShadowColor: "rgba(0, 0, 0, 0.6)",
                      textShadowOffset: {width: 0, height: 1},
                      textShadowRadius: 1,
                  }
                : {}),
        },
        underline: {
            position: "absolute",
            width: "100%",
            backgroundColor: theme.accentTernary,
            zIndex: 1,
        },
    });
});

export default withTheme(SemiHighlightedText);
