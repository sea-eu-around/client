import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import {Text, View, TouchableOpacity} from "react-native";
import {withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import {onboardingStyle} from "../../styles/onboarding";
import {ThemeProps} from "../../types";
import {finishOnboarding} from "./helpers";
import i18n from "i18n-js";

export type OnboardingScreenProps = {
    index: number;
    previous: () => void;
    next: () => void;
    hasNext: boolean;
};

// Map props from state
const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
}));

export type OnboardingSlideProps = {
    title?: string;
    subtitle?: string;
    handleSubmit?: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
    hideNavNext?: boolean;
    isLastSlide?: boolean;
} & OnboardingScreenProps &
    ThemeProps &
    ConnectedProps<typeof reduxConnector>;

class OnboardingSlide extends React.Component<OnboardingSlideProps> {
    render(): JSX.Element {
        const {
            title,
            subtitle,
            index,
            hideNavNext,
            hasNext,
            isLastSlide,
            onboardingState,
            handleSubmit,
            next,
            theme,
        } = this.props;
        const styles = onboardingStyle(theme);

        const hasPrevious = index > 0;

        const navigateRight = () => {
            if (handleSubmit) handleSubmit();
            else if (hasNext) next();
        };

        return (
            <View style={styles.slideWrapper}>
                <View style={styles.slideContentWrapper}>
                    <View style={styles.header}>
                        {title && <Text style={styles.title}>{title}</Text>}
                        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                    </View>
                    {this.props.children}
                </View>
                <View style={styles.slideNavWrapper}>
                    {hasPrevious && (
                        <TouchableOpacity style={styles.navButton} onPress={() => this.props.previous()}>
                            <FontAwesome style={styles.navButtonIcon} name="arrow-circle-left"></FontAwesome>
                        </TouchableOpacity>
                    )}
                    {!isLastSlide && !hideNavNext && hasNext && (
                        <TouchableOpacity
                            style={styles.navButton}
                            /*onPress={() => this.props.navigation.navigate(next)}*/ onPress={navigateRight}
                        >
                            <FontAwesome style={styles.navButtonIcon} name="arrow-circle-right"></FontAwesome>
                        </TouchableOpacity>
                    )}
                    {isLastSlide && (
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => {
                                finishOnboarding(onboardingState);
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

export default reduxConnector(withTheme(OnboardingSlide));
