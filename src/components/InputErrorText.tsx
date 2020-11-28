import * as React from "react";
import {Text, TextProps, StyleSheet} from "react-native";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {localizeError} from "../api/errors";

// Component props
export type InputErrorTextProps = ThemeProps & TextProps & {error: string | string[] | null | undefined};

class InputErrorText extends React.Component<InputErrorTextProps> {
    render(): JSX.Element {
        const {theme, style, error, ...otherProps} = this.props;
        const styles = themedStyles(theme);

        const errorStr: string | null = error ? (typeof error === "string" ? error : error[0]) : null;

        return (
            <Text {...otherProps} style={[styles.text, style]}>
                {errorStr ? localizeError(errorStr) : ""}
            </Text>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        text: {
            fontSize: 12,
            marginTop: 2,
            marginBottom: -12, // prevents an offset from appearing when there is an error
            color: theme.error,
        },
    });
});

export default withTheme(InputErrorText);
