import * as React from "react";
import {StyleSheet, View} from "react-native";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";
import {preTheme} from "../styles/utils";

type ScreenWrapperProps = ThemeProps & {forceFullWidth?: boolean};

class ScreenWrapper extends React.Component<ScreenWrapperProps> {
    render(): JSX.Element {
        const {theme, forceFullWidth} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.wrapper}>
                <View style={[styles.container, forceFullWidth ? {maxWidth: undefined} : {}]}>
                    {this.props.children}
                </View>
            </View>
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        wrapper: {
            flex: 1,
            justifyContent: "center",
            flexDirection: "row",
            overflow: "hidden",
        },
        container: {
            flex: 1,
            alignItems: "center",
            maxWidth: 1000,
        },
    });
});

export default withTheme(ScreenWrapper);
