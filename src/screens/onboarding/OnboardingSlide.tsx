import * as React from "react";
import {Text, View, ScrollView, KeyboardAvoidingView, ViewStyle, StyleProp, Alert, Platform} from "react-native";
import {withTheme} from "react-native-elements";
import {onboardingStyle} from "../../styles/onboarding";
import {ThemeProps} from "../../types";
import {finishOnboarding} from "./helpers";
import i18n from "i18n-js";
import store from "../../state/store";
import ScreenWrapper from "../ScreenWrapper";
import {logout} from "../../state/auth/actions";
import Button from "../../components/Button";
import layout from "../../constants/layout";
import {SafeAreaInsetsContext} from "react-native-safe-area-context";

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
    background?: JSX.Element;
    illustration?: JSX.Element;
    textColor?: string;
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
            background,
            illustration,
            textColor,
            noKeyboardAvoidance,
            theme,
        } = this.props;
        const styles = onboardingStyle(theme);

        const hasPrevious = index > 0;

        const navigateRight = () => {
            if (handleSubmit) handleSubmit();
            else if (hasNext) next();
        };

        const wide = layout.isWideDevice;

        return (
            <ScreenWrapper forceFullWidth containerStyle={styles.root}>
                {wide ? <View style={styles.wideDeviceLeftPanel}>{illustration}</View> : <></>}
                <View style={styles.slideWrapper}>
                    {background}
                    <ScrollView
                        style={styles.slideScrollView}
                        contentContainerStyle={[containerStyle, styles.slideContentWrapper]}
                    >
                        <KeyboardAvoidingView
                            behavior="position"
                            keyboardVerticalOffset={70}
                            enabled={!noKeyboardAvoidance}
                            style={styles.slideContentContainer}
                        >
                            <View style={styles.header}>
                                {title && typeof title === "string" && (
                                    <Text style={[styles.title, textColor ? {color: textColor} : {}]}>{title}</Text>
                                )}
                                {title && typeof title !== "string" && title}
                                {subtitle && (
                                    <Text style={[styles.subtitle, textColor ? {color: textColor} : {}]}>
                                        {subtitle}
                                    </Text>
                                )}
                            </View>
                            {!wide && illustration}
                            {this.props.children}
                        </KeyboardAvoidingView>
                    </ScrollView>
                    <SafeAreaInsetsContext.Consumer>
                        {(insets) => (
                            <View style={[styles.slideNavWrapper, {marginBottom: (insets?.bottom || 0) + 40}]}>
                                <View style={styles.slideNavButtons}>
                                    {hasPrevious && (
                                        <Button
                                            style={[styles.navButton, styles.navButtonBack]}
                                            skin="rounded-hollow"
                                            text={i18n.t("onboarding.back")}
                                            onPress={() => this.props.previous()}
                                        />
                                    )}
                                    {!hasPrevious && (
                                        <Button
                                            style={[styles.navButton, styles.navButtonBack]}
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
                        )}
                    </SafeAreaInsetsContext.Consumer>
                </View>
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
