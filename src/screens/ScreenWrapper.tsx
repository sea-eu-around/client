import * as React from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";
import {preTheme} from "../styles/utils";

type ScreenWrapperProps = ThemeProps & {
    forceFullWidth?: boolean;
    wrapperStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
};

class ScreenWrapper extends React.Component<ScreenWrapperProps> {
    render(): JSX.Element {
        const {theme, forceFullWidth, wrapperStyle, containerStyle} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={[styles.wrapper, wrapperStyle]}>
                <View style={[styles.container, forceFullWidth ? {maxWidth: undefined} : {}, containerStyle]}>
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
