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

// Component props
type OnboardingLegalSlideProps = ThemeProps & OnboardingScreenProps & {title: string; text: string};

class OnboardingLegalSlide extends React.Component<OnboardingLegalSlideProps> {
    render(): JSX.Element {
        const {theme, title, text, next, ...otherProps} = this.props;
        const styles = themedStyles(theme);

        return (
            <OnboardingSlide title={title} hideNavNext={true} next={next} {...otherProps}>
                <Text style={styles.legalText}>{text}</Text>
                <Text style={styles.readMoreText}>
                    {i18n.t("legal.readMore")[0]}
                    <TextLink
                        onPress={() => Linking.openURL(TERMS_AND_CONDITIONS_URL)}
                        text={i18n.t("legal.readMore")[1]}
                    />
                    {i18n.t("legal.readMore")[2]}
                </Text>

                <View style={styles.actionsWrapper}>
                    <TOSDeclinedModal
                        activator={(show) => (
                            <TouchableOpacity style={styles.actionButton} onPress={show}>
                                <Text style={styles.actionButtonTextDecline}>{i18n.t("legal.decline")}</Text>
                                <MaterialIcons name="close" style={styles.actionButtonTextDecline} />
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.actionButton} onPress={() => next()}>
                        <Text style={styles.actionButtonTextAccept}>{i18n.t("legal.accept")}</Text>
                        <MaterialIcons name="check" style={styles.actionButtonTextAccept} />
                    </TouchableOpacity>
                </View>
            </OnboardingSlide>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        actionsWrapper: {
            flexDirection: "row",
            justifyContent: "space-around",
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
        },
        actionButtonTextDecline: {
            fontSize: 16,
            paddingHorizontal: 2,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: theme.error,
        },
        actionButtonTextAccept: {
            fontSize: 16,
            paddingHorizontal: 2,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: theme.okay,
        },
        readMoreText: {
            fontSize: 16,
            lineHeight: 20,
            textAlign: "justify",
            marginVertical: 30,
            letterSpacing: 0.4,
            color: theme.textLight,
        },
        legalText: {
            textAlign: "justify",
            fontSize: 16,
            lineHeight: 22,
            color: theme.text,
        },
    });
});

export default withTheme(OnboardingLegalSlide);
