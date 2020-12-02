import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import {Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView} from "react-native";
import {withTheme} from "react-native-elements";
import {onboardingStyle} from "../../styles/onboarding";
import {ThemeProps} from "../../types";
import {finishOnboarding} from "./helpers";
import i18n from "i18n-js";
import store from "../../state/store";

export type OnboardingScreenProps = {
    index: number;
    previous: () => void;
    next: () => void;
    hasNext: boolean;
};

export type OnboardingSlideProps = {
    title?: string;
    subtitle?: string;
    handleSubmit?: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
    hideNavNext?: boolean;
} & OnboardingScreenProps &
    ThemeProps;

class OnboardingSlide extends React.Component<OnboardingSlideProps> {
    render(): JSX.Element {
        const {title, subtitle, index, hideNavNext, hasNext, handleSubmit, next, theme} = this.props;
        const styles = onboardingStyle(theme);

        const hasPrevious = index > 0;

        const navigateRight = () => {
            if (handleSubmit) handleSubmit();
            else if (hasNext) next();
        };

        return (
            <View style={styles.slideWrapper}>
                <ScrollView style={styles.slideScrollView} contentContainerStyle={styles.slideContentWrapper}>
                    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={60}>
                        <View style={styles.header}>
                            {title && <Text style={styles.title}>{title}</Text>}
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
                                finishOnboarding(store.getState().auth.onboarding);
                            }}
                        >
                            <Text style={styles.finishButtonText}>{i18n.t("onboarding.submit")}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }
}

export default withTheme(OnboardingSlide);
