import * as React from "react";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import TOSDeclinedModal from "../../components/modals/TOSDeclinedModal";
import i18n from "i18n-js";
import TextLink from "../../components/TextLink";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {TERMS_AND_CONDITIONS_URL} from "../../constants/config";
import {Linking} from "expo";
import {LinearGradient} from "expo-linear-gradient";
import layout from "../../constants/layout";

// Component props
type OnboardingLegalSlideProps = ThemeProps &
    OnboardingScreenProps & {title: string; text: string; specialBackground?: boolean};

class OnboardingLegalSlide extends React.Component<OnboardingLegalSlideProps> {
    render(): JSX.Element {
        const {theme, title, text, specialBackground, next, ...otherProps} = this.props;
        const styles = themedStyles(theme);

        const wide = layout.isWideDevice;
        const gradient = <LinearGradient style={styles.background} colors={[theme.accent, "#862ADF"]} />;
        const textColor = specialBackground && !wide ? theme.textWhite : theme.textLight;

        return (
            <OnboardingSlide
                title={title}
                hideNavNext={true}
                next={next}
                {...(specialBackground && !wide
                    ? {
                          background: gradient,
                          textColor: theme.textWhite,
                      }
                    : {})}
                illustration={wide ? gradient : <></>}
                {...otherProps}
            >
                <Text style={[styles.legalText, {color: textColor}]}>{text}</Text>
                <Text style={[styles.readMoreText, {color: textColor}]}>
                    {i18n.t("legal.readMore")[0]}
                    <TextLink
                        onPress={() => Linking.openURL(TERMS_AND_CONDITIONS_URL)}
                        text={i18n.t("legal.readMore")[1]}
                        style={{fontWeight: "bold"}}
                    />
                    {i18n.t("legal.readMore")[2]}
                </Text>

                <View style={styles.actionsWrapper}>
                    <TOSDeclinedModal
                        activator={(show) => (
                            <TouchableOpacity style={[styles.actionButton, styles.actionButtonDecline]} onPress={show}>
                                <Text style={styles.actionButtonText}>{i18n.t("legal.decline")}</Text>
                                <MaterialIcons name="close" style={styles.actionButtonText} />
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={[styles.actionButton, styles.actionButtonAccept]} onPress={() => next()}>
                        <Text style={styles.actionButtonText}>{i18n.t("legal.accept")}</Text>
                        <MaterialIcons name="check" style={styles.actionButtonText} />
                    </TouchableOpacity>
                </View>
            </OnboardingSlide>
        );
    }
}

const buttonsRadius = 100;

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        background: {
            position: "absolute",
            width: "100%",
            height: "100%",
        },
        actionsWrapper: {
            flexDirection: "row",
            justifyContent: "space-around",
            borderRadius: buttonsRadius,

            shadowColor: "#000",
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            elevation: 10,
        },
        actionButton: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 14,
        },
        actionButtonDecline: {
            backgroundColor: theme.error,
            borderTopLeftRadius: buttonsRadius,
            borderBottomLeftRadius: buttonsRadius,
        },
        actionButtonAccept: {
            backgroundColor: theme.okay,
            borderTopRightRadius: buttonsRadius,
            borderBottomRightRadius: buttonsRadius,
        },
        actionButtonText: {
            fontSize: 18,
            paddingHorizontal: 2,
            color: theme.textWhite,
        },
        readMoreText: {
            fontSize: 16,
            lineHeight: 20,
            textAlign: "justify",
            marginVertical: 30,
            letterSpacing: 0.4,
        },
        legalText: {
            textAlign: "justify",
            fontSize: 16,
            lineHeight: 22,
        },
    });
});

export default withTheme(OnboardingLegalSlide);
