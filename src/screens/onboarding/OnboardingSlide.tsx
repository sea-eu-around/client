import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    ViewStyle,
    StyleProp,
    Alert,
    Dimensions,
} from "react-native";
import {withTheme} from "react-native-elements";
import {onboardingStyle} from "../../styles/onboarding";
import {ThemeProps} from "../../types";
import {finishOnboarding} from "./helpers";
import i18n from "i18n-js";
import store from "../../state/store";
import ScreenWrapper from "../ScreenWrapper";
import {logout} from "../../state/auth/actions";
import {getLocalSvg} from "../../assets";
import WavyHeader from "../../components/headers/WavyHeader";

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

        const Background = getLocalSvg("background.onboarding", () => this.forceUpdate());
        const {width, height} = Dimensions.get("screen");
        return (
            <ScreenWrapper>
                <View style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 1}}>
                    <WavyHeader
                        customStyles={styles.svgCurve}
                        customHeight={210}
                        customTop={170}
                        customBgColor={theme.accent}
                        customWavePattern="M0,160L48,181.3C96,203,192,245,288,261.3C384,277,480,267,576,224C672,181,768,107,864,106.7C960,107,1056,181,1152,202.7C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                    />
                    <Background
                        preserveAspectRatio={"true"}
                        viewBox={`${50} ${50} ${width * 1.25} ${height * 1.25}`}
                        style={{width, height}}
                    />
                </View>
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
                    {!hasPrevious && (
                        <TouchableOpacity style={styles.navButton} onPress={() => this.quitOnboarding()}>
                            <FontAwesome style={styles.navButtonIcon} name="arrow-circle-left"></FontAwesome>
                        </TouchableOpacity>
                    )}
                    {!hideNavNext && hasNext && (
                        <TouchableOpacity style={styles.navButton} onPress={navigateRight}>
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

    quitOnboarding() {
        Alert.alert(i18n.t("onboarding.quit.title"), i18n.t("onboarding.quit.text"), [
            {
                text: i18n.t("onboarding.quit.cancel"),
                style: "cancel",
            },
            {text: i18n.t("onboarding.quit.yes"), onPress: () => store.dispatch(logout()), style: "destructive"},
        ]);
    }
}

export default withTheme(OnboardingSlide);
