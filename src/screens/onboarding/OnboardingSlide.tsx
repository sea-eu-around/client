import * as React from "react";
import {Text, View, TouchableOpacity} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {OnboardingProps} from ".";
import themes from "../../constants/themes";
import {AppState} from "../../state/types";
import {onboardingStyle} from "../../styles/onboarding";
import {ONBOARDING_ORDER} from ".";

const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
}));

export type OnboardingSlideProps = {
    title?: string;
    subtitle?: string;
    handleSubmit?: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
    hideNavNext?: boolean;
} & OnboardingProps &
    ConnectedProps<typeof reduxConnector>;

class OnboardingSlide extends React.Component<OnboardingSlideProps> {
    render(): JSX.Element {
        const {title, subtitle, index, hideNavNext, handleSubmit, next} = this.props;

        const hasPrevious = index > 0;
        const hasNext = index < ONBOARDING_ORDER.length - 1;

        const navigateRight = () => {
            if (handleSubmit) handleSubmit();
            else next();
        };

        return (
            <View style={onboardingStyle.slideWrapper}>
                <View style={onboardingStyle.slideContentWrapper}>
                    <View style={onboardingStyle.header}>
                        {title && <Text style={onboardingStyle.title}>{title}</Text>}
                        {subtitle && <Text style={onboardingStyle.subtitle}>{subtitle}</Text>}
                    </View>
                    {this.props.children}
                </View>
                <View style={onboardingStyle.slideNavWrapper}>
                    {hasPrevious && (
                        <TouchableOpacity style={onboardingStyle.navButton} onPress={() => this.props.previous()}>
                            <Text style={onboardingStyle.navButtonText}>← previous</Text>
                        </TouchableOpacity>
                    )}
                    {!hideNavNext && hasNext && (
                        <TouchableOpacity
                            style={onboardingStyle.navButton}
                            /*onPress={() => this.props.navigation.navigate(next)}*/ onPress={navigateRight}
                        >
                            <Text style={onboardingStyle.navButtonText}>next →</Text>
                        </TouchableOpacity>
                    )}
                    {!hasNext && (
                        <TouchableOpacity style={onboardingStyle.navButton} onPress={navigateRight}>
                            <Text style={onboardingStyle.navButtonText}>finish →</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }
}

export default reduxConnector(OnboardingSlide);
