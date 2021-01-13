import * as React from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import {withTheme} from "react-native-elements";
import {rootNavigate} from "../../navigation/utils";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import i18n from "i18n-js";
import ScreenWrapper from "../ScreenWrapper";
import {getLocalSvg} from "../../assets";
import Button from "../../components/Button";
import layout from "../../constants/layout";

export type OnboardingSuccessfulScreenProps = ThemeProps;

class OnboardingSuccessfulScreen extends React.Component<OnboardingSuccessfulScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        const BackgroundSvg = getLocalSvg("large-wave-bg", () => this.forceUpdate());
        const ForegroundSvg = getLocalSvg("woman-holding-phone", () => this.forceUpdate());

        const height = Dimensions.get("window").height;

        return (
            <ScreenWrapper forceFullWidth>
                <View style={styles.root}>
                    {layout.isWideDevice ? (
                        <View style={styles.largeDeviceLeftPanel}>
                            <View style={{position: "absolute", bottom: -150, left: -100, width: "100%"}}>
                                <ForegroundSvg />
                            </View>
                        </View>
                    ) : (
                        <>
                            <View
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    ...(height > 1000 ? {bottom: 0} : {top: 250}),
                                }}
                            >
                                <BackgroundSvg width="100%" />
                            </View>
                            <View
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    ...(height > 1000 ? {bottom: -200} : {top: 350}),
                                    left: -100,
                                }}
                            >
                                <ForegroundSvg />
                            </View>
                        </>
                    )}
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.title}>{i18n.t("onboarding.success.title")}</Text>
                            <Text style={styles.subtitle}>{i18n.t("onboarding.success.subtitle")}</Text>
                        </View>
                        <Button
                            text={i18n.t("onboarding.success.button")}
                            onPress={() => rootNavigate("MainScreen")}
                            skin="rounded-filled"
                            style={{opacity: 0.9}}
                        />
                    </View>
                </View>
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme, wideDevice: boolean) => {
    return StyleSheet.create({
        root: {
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "center",
        },
        largeDeviceLeftPanel: {
            width: "50%",
            backgroundColor: "#0071BB",
        },
        container: {
            width: wideDevice ? "50%" : "100%",
            height: "100%",
            paddingTop: wideDevice ? 200 : 100,
            paddingBottom: 100,
            paddingHorizontal: 60,
            justifyContent: "space-between",
            alignItems: wideDevice ? "center" : "flex-start",
        },
        title: {
            fontSize: 36,
            letterSpacing: 0.5,
            lineHeight: 40,
            color: theme.text,
            fontWeight: "600",
            maxWidth: wideDevice ? 9999 : 200,
            textAlign: wideDevice ? "center" : "left",
        },
        subtitle: {
            fontSize: 18,
            marginTop: 20,
            color: theme.text,
            textAlign: wideDevice ? "center" : "left",
        },
    });
});

export default withTheme(OnboardingSuccessfulScreen);
