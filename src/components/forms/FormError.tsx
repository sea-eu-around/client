import * as React from "react";

import {Text, View, ViewProps, StyleSheet} from "react-native";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";

// Component props
export type FormErrorProps = ThemeProps & {
    error: string;
} & ViewProps;

class FormError extends React.Component<FormErrorProps> {
    render(): JSX.Element {
        const {error, theme, style, ...otherProps} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={[styles.wrapper, style]} {...otherProps}>
                <Text style={[styles.text]}>{error}</Text>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            marginVertical: 10,
        },
        text: {
            fontSize: 14,
            color: theme.error,
        },
    });
});

export default withTheme(FormError);
