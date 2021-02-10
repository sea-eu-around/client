import * as React from "react";
import {Text, View, ViewProps, StyleSheet, StyleProp, TextStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import {localizeError} from "../../api/errors";

// Component props
export type FormErrorProps = ThemeProps & {
    error?: string;
    textStyle?: StyleProp<TextStyle>;
} & ViewProps;

class FormError extends React.Component<FormErrorProps> {
    render(): JSX.Element {
        const {error, theme, style, textStyle, ...otherProps} = this.props;
        const styles = themedStyles(theme);

        return (
            <>
                {error && error.length > 0 && (
                    <View style={[styles.wrapper, style]} {...otherProps}>
                        <Text style={[styles.text, textStyle]}>{localizeError(error)}</Text>
                    </View>
                )}
            </>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            marginTop: 5,
        },
        text: {
            fontSize: 14,
            color: theme.error,
            textAlign: "center",
        },
    });
});

export default withTheme(FormError);
