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
import {DEBUG_MODE} from "../../constants/config";
import {LinearGradient} from "expo-linear-gradient";

export type OnboardingSuccessfulScreenProps = ThemeProps;

class OnboardingSuccessfulScreen extends React.Component<OnboardingSuccessfulScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        const BackgroundSvg = getLocalSvg("large-wave-bg", () => this.forceUpdate());
        const ForegroundSvg = getLocalSvg("woman-holding-phone", () => this.forceUpdate());

        const width = Dimensions.get("window").width;
        const height = Dimensions.get("window").height;
        const svgHeight = width * (700 / 450);
        const offset = Math.max(250, height - svgHeight + 30);

        return (
            <ScreenWrapper forceFullWidth>
                <View style={styles.root}>
                    {layout.isWideDevice ? (
                        <View style={styles.wideDeviceLeftPanel}>
                            <LinearGradient
                                style={styles.gradient}
                                colors={["#32C5FF", "#B620E0", "#F7B500"]}
                                locations={[0.0, 0.6, 1.0]}
                                start={{x: 1, y: 0}}
                                end={{x: 0.3, y: 0.6}}
                            />
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
                                    top: offset,
                                }}
                            >
                                <BackgroundSvg width={width} height={width * (700 / 450)} viewBox="0 0 450 700" />
                            </View>
                            <View
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    top: offset + 100,
                                    left: -100,
                                }}
                            >
                                <ForegroundSvg width={width} height={width * (750 / 500)} viewBox="0 0 500 750" />
                            </View>
                        </>
                    )}
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.title}>{i18n.t("onboarding.success.title")}</Text>
                            <Text style={styles.subtitle}>{i18n.t("onboarding.success.subtitle")}</Text>
                            {layout.isWideDevice && (
                                /* Hey, you have found an easter egg...plant */
                                <Text style={styles.wideDeviceIcon}>{DEBUG_MODE ? "🍆" : "🚀"}</Text>
                            )}
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
        wideDeviceLeftPanel: {
            width: "50%",
        },
        gradient: {
            width: "100%",
            height: "100%",
        },
        container: {
            width: wideDevice ? "50%" : "100%",
            height: "100%",
            paddingTop: wideDevice ? 150 : 100,
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
        wideDeviceIcon: {
            fontSize: 80,
            textAlign: "center",
            marginVertical: 100,
        },
    });
});

export default withTheme(OnboardingSuccessfulScreen);
