import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import {Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, ViewStyle, StyleProp} from "react-native";
import {withTheme} from "react-native-elements";
import {onboardingStyle} from "../../styles/onboarding";
import {ThemeProps} from "../../types";
import {finishOnboarding} from "./helpers";
import i18n from "i18n-js";
import store from "../../state/store";
import ScreenWrapper from "../ScreenWrapper";

export type OnboardingScreenProps = {
    index: number;
    previous: () => void;
    next: () => void;
    hasNext: boolean;
    noKeyboardAvoidance?: boolean;
};

export type OnboardingSlideProps = {
    title?: string | JSX.Element;
    subtitle?: string;
    handleSubmit?: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
    hideNavNext?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
} & OnboardingScreenProps &
    ThemeProps;

class OnboardingSlide extends React.Component<OnboardingSlideProps> {
    render(): JSX.Element {
        const {
            title,
            subtitle,
            index,
            hideNavNext,
            hasNext,
            handleSubmit,
            next,
            containerStyle,
            noKeyboardAvoidance,
            theme,
        } = this.props;
        const styles = onboardingStyle(theme);

        const hasPrevious = index > 0;

        const navigateRight = () => {
            if (handleSubmit) handleSubmit();
            else if (hasNext) next();
        };

        return (
            <ScreenWrapper>
                <ScrollView
                    style={styles.slideScrollView}
                    contentContainerStyle={[containerStyle, styles.slideContentWrapper]}
                >
                    <KeyboardAvoidingView
                        behavior="position"
                        keyboardVerticalOffset={70}
                        enabled={!noKeyboardAvoidance}
                    >
                        <View style={styles.header}>
                            {title && typeof title === "string" && <Text style={styles.title}>{title}</Text>}
                            {title && typeof title !== "string" && title}
                            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                        </View>
                        {this.props.children}
                    </KeyboardAvoidingView>
                </ScrollView>
                <View style={styles.slideNavWrapper}>
                    {hasPrevious && (
                        <TouchableOpacity style={styles.navButton} onPress={() => this.props.previous()}>
                            <FontAwesome style={styles.navButtonIcon} name="arrow-circle-left"></FontAwesome>
                        </TouchableOpacity>
                    )}
                    {!hideNavNext && hasNext && (
                        <TouchableOpacity
                            style={styles.navButton}
                            /*onPress={() => this.props.navigation.navigate(next)}*/ onPress={navigateRight}
                        >
                            <FontAwesome style={styles.navButtonIcon} name="arrow-circle-right"></FontAwesome>
                        </TouchableOpacity>
                    )}
                    {!hasNext && (
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => {
                                if (handleSubmit) handleSubmit();
                                finishOnboarding(store.getState().auth.onboarding);
                            }}
                        >
                            <Text style={styles.finishButtonText}>{i18n.t("onboarding.submit")}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScreenWrapper>
        );
    }
}

export default withTheme(OnboardingSlide);
