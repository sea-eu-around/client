import * as React from "react";
import {
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    ViewStyle,
    StyleProp,
    Alert,
    Dimensions,
    Platform,
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
import FloatingThemeToggle from "../../components/FloatingThemeToggle";
import Button from "../../components/Button";

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

function ButtonSpacer(): JSX.Element {
    return <View style={{width: 10, height: 1}}></View>;
}

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
                <View style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 1, zIndex: 0}}>
                    <Background
                        preserveAspectRatio={"true"}
                        viewBox={`${50} ${50} ${width * 1.25} ${height * 1.25}`}
                        style={{width, height}}
                    />
                </View>
                <View style={styles.wrapper}>
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
                        <View style={styles.slideNavButtons}>
                            {hasPrevious && (
                                <Button
                                    style={styles.navButton}
                                    skin="rounded-hollow"
                                    text={i18n.t("onboarding.back")}
                                    onPress={() => this.props.previous()}
                                />
                            )}
                            {!hasPrevious && (
                                <Button
                                    style={styles.navButton}
                                    skin="rounded-hollow"
                                    text={i18n.t("onboarding.leave")}
                                    onPress={() => this.quitOnboarding()}
                                />
                            )}
                            {!hideNavNext && hasNext && (
                                <>
                                    <ButtonSpacer />
                                    <Button
                                        style={styles.navButton}
                                        skin="rounded-filled"
                                        text={i18n.t("onboarding.next")}
                                        onPress={navigateRight}
                                    />
                                </>
                            )}
                            {!hasNext && (
                                <>
                                    <ButtonSpacer />
                                    <Button
                                        style={styles.navButton}
                                        skin="rounded-filled"
                                        text={i18n.t("onboarding.submit")}
                                        onPress={() => {
                                            if (handleSubmit) handleSubmit();
                                            finishOnboarding(store.getState().auth.onboarding);
                                        }}
                                    />
                                </>
                            )}
                        </View>
                    </View>
                </View>
                <FloatingThemeToggle />
            </ScreenWrapper>
        );
    }

    quitOnboarding() {
        const quit = () => store.dispatch(logout());

        if (Platform.OS === "web") {
            quit(); // no alerts on web
        } else {
            Alert.alert(i18n.t("onboarding.quit.title"), i18n.t("onboarding.quit.text"), [
                {
                    text: i18n.t("onboarding.quit.cancel"),
                    style: "cancel",
                },
                {text: i18n.t("onboarding.quit.yes"), onPress: quit, style: "destructive"},
            ]);
        }
    }
}

export default withTheme(OnboardingSlide);
