import * as React from "react";
import {View, StyleSheet, StyleProp, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import {ONBOARDING_ORDER} from "../screens/onboarding";
import ReAnimated, {Easing} from "react-native-reanimated";
import {SafeAreaInsetsContext} from "react-native-safe-area-context";
import {animateValue} from "../polyfills";

export type OnboardingProgressBarProps = {
    index: number;
    style?: StyleProp<ViewStyle>;
    foregroundStyle?: StyleProp<ViewStyle>;
} & ThemeProps;

class OnboardingProgressBar extends React.Component<OnboardingProgressBarProps> {
    containerWidth = 0;
    width = new ReAnimated.Value<number>(0);

    componentDidMount() {
        this.setIndex(this.props.index);
    }

    componentDidUpdate(oldProps: OnboardingProgressBarProps): void {
        const {index} = this.props;
        if (oldProps.index !== index) this.setIndex(index);
    }

    private setIndex(index: number) {
        const progress = (index + 1) / ONBOARDING_ORDER.length;
        const targetWidth = progress * this.containerWidth;

        animateValue(this.width, {
            toValue: targetWidth,
            duration: 150,
            easing: Easing.sin,
        });
    }

    render(): JSX.Element {
        const {style, foregroundStyle, theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <SafeAreaInsetsContext.Consumer>
                {(insets) => (
                    <View
                        style={[styles.background, {bottom: (insets?.bottom || 0) + 15}, style]}
                        onLayout={(layout) => {
                            this.containerWidth = layout.nativeEvent.layout.width;
                            this.setIndex(this.props.index);
                        }}
                    >
                        <ReAnimated.View style={[styles.foreground, {width: this.width}, foregroundStyle]} />
                    </View>
                )}
            </SafeAreaInsetsContext.Consumer>
        );
    }
}

export const themedStyles = preTheme((theme: Theme, isWideDevice: boolean) => {
    return StyleSheet.create({
        background: {
            position: "absolute",
            left: isWideDevice ? "55%" : "10%",

            width: isWideDevice ? "40%" : "80%",
            height: 8,
            borderRadius: 8,
            backgroundColor: theme.accentSlight,
        },
        foreground: {
            borderRadius: 8,
            backgroundColor: theme.accent,
            height: "100%",
        },
    });
});

export default withTheme(OnboardingProgressBar);
