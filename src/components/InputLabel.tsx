import * as React from "react";
import {Text, TextProps, StyleSheet} from "react-native";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";

// Component props
export type InputLabelProps = ThemeProps & TextProps;

class InputLabel extends React.Component<InputLabelProps> {
    render(): JSX.Element {
        const {theme, style, ...otherProps} = this.props;
        const styles = themedStyles(theme);

        return (
            <Text {...otherProps} style={[styles.text, style]}>
                {this.props.children}
            </Text>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        text: {
            color: theme.textLight,
            textTransform: "uppercase",
            letterSpacing: 1,
            fontSize: 12,
        },
    });
});

export default withTheme(InputLabel);
