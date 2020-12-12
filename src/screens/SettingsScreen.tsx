import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {Alert, ScrollView, StyleSheet, Switch, Text, TouchableHighlight, View} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {RootNavigatorScreens} from "../navigation/types";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import ScreenWrapper from "./ScreenWrapper";
import ValueCard from "../components/forms/ValueCard";
import i18n from "i18n-js";
import {FontAwesome, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {AppState} from "../state/types";
import {setLocale, toggleTheme} from "../state/settings/actions";
import LocalePicker from "../components/LocalePicker";
import {SupportedLocale} from "../localization";
import {rootNavigate} from "../navigation/utils";
import {APP_VERSION} from "../constants/config";
import LocalImage from "../components/LocalImage";
import {TouchableOpacity} from "react-native-gesture-handler";
import {logout} from "../state/auth/actions";

const reduxConnector = connect((state: AppState) => ({
    settings: state.settings.userSettings,
}));

// Component props
type SettingsScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps & StackScreenProps<RootNavigatorScreens>;

let versionClickCount = 0;

class SettingsScreen extends React.Component<SettingsScreenProps> {
    render(): JSX.Element {
        const {theme, settings, dispatch} = this.props;
        const styles = themedStyles(theme);
        console.log(theme);
        return (
            <ScreenWrapper>
                <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
                    <Section theme={theme} title={i18n.t("settings.sections.general")}>
                        <ValueCard
                            style={styles.card}
                            label={i18n.t("settings.language")}
                            icon={<FontAwesome name="language" style={styles.cardIcon} />}
                            oneLine={true}
                            display={
                                <LocalePicker
                                    locale={settings.locale}
                                    onChange={(l: SupportedLocale) => {
                                        if (l == "fr") {
                                            // TEMP FR Translation disclaimer
                                            Alert.alert(
                                                "Disclaimer",
                                                "The application has not been translated to french yet.",
                                            );
                                        }
                                        dispatch(setLocale(l));
                                    }}
                                    buttonStyle={styles.localeButton}
                                    valueStyle={styles.localButtonValue}
                                />
                            }
                            noModal={true}
                        />
                        <ValueCard
                            style={styles.card}
                            label={i18n.t("settings.darkTheme")}
                            icon={<MaterialCommunityIcons name="theme-light-dark" style={styles.cardIcon} />}
                            oneLine={true}
                            onPress={() => dispatch(toggleTheme())}
                            display={
                                <Switch
                                    value={settings.theme === "dark"}
                                    onValueChange={() => dispatch(toggleTheme())}
                                />
                            }
                            noModal={true}
                        />
                    </Section>
                    <Section
                        theme={theme}
                        title={i18n.t("settings.sections.about")}
                        icon={{name: "info", color: theme.accent}}
                    >
                        <ValueCard
                            style={styles.card}
                            label={i18n.t("settings.version")}
                            oneLine={true}
                            onPress={() => {
                                // Easter-egg trigger
                                versionClickCount++;
                                if (versionClickCount === 7) {
                                    versionClickCount = 0;
                                    Alert.alert("Insert easter egg here");
                                }
                                setTimeout(() => (versionClickCount = Math.max(0, versionClickCount - 1)), 3000);
                            }}
                            display={<Text style={styles.infoText}>{APP_VERSION}</Text>}
                            noModal={true}
                        />
                        <ValueCard
                            style={styles.card}
                            label={i18n.t("settings.termsOfService")}
                            oneLine={true}
                            onPress={() => Alert.alert("Not implemented")} // TODO Implement TOS link
                            display={<Text style={styles.infoText}>{""}</Text>}
                            noModal={true}
                        />
                        <ValueCard
                            style={styles.card}
                            label={i18n.t("settings.reportABug")}
                            icon={<MaterialIcons name="bug-report" style={styles.cardIcon} />}
                            oneLine={true}
                            onPress={() => Alert.alert("Not implemented")} // TODO Implement bug reports
                            display={<Text style={styles.infoText}>{""}</Text>}
                            noModal={true}
                        />
                        <ValueCard
                            style={styles.card}
                            label={i18n.t("settings.logOut")}
                            icon={<MaterialCommunityIcons name="logout" style={styles.cardIcon} />}
                            oneLine={true}
                            display={
                                <TouchableOpacity
                                    style={[styles.redActionButton, styles.logoutButton]}
                                    onPress={() => dispatch(logout())}
                                >
                                    <Text style={styles.logoutText}>{i18n.t("settings.logOut")}</Text>
                                </TouchableOpacity>
                            }
                            noModal={true}
                        />
                    </Section>
                    <Section
                        theme={theme}
                        title={i18n.t("settings.sections.danger")}
                        icon={{name: "warning", color: theme.warn}}
                    >
                        <ValueCard
                            style={styles.card}
                            label={i18n.t("settings.deleteAccount")}
                            display={
                                // TODO enable Delete Account
                                <TouchableHighlight
                                    style={styles.redActionButton}
                                    //onPress={() => rootNavigate("DeleteAccountScreen")}
                                    onPress={() => Alert.alert("Coming very soon")}
                                >
                                    <Text style={styles.deleteAccountText}>{i18n.t("settings.deleteMyAccount")}</Text>
                                </TouchableHighlight>
                            }
                            noModal={true}
                        />
                    </Section>
                    <View style={styles.logosContainer}>
                        <LocalImage
                            imageKey="logos.sea-eu-around.small"
                            resizeMode="contain"
                            style={[styles.logo, styles.logoSeaEuAround]}
                        />
                        <LocalImage
                            imageKey="logos.erasmusLeft"
                            resizeMode="contain"
                            style={[styles.logo, styles.logoErasmus]}
                        />

                        <Text style={styles.developedBy}>{i18n.t("settings.developedBy")}</Text>
                        <LocalImage
                            imageKey="logos.junior-atlantique"
                            resizeMode="contain"
                            style={[styles.logo, styles.logoJA]}
                        />
                    </View>
                </ScrollView>
            </ScreenWrapper>
        );
    }
}

type SectionProps = {
    theme: Theme;
    title: string;
    icon?: {name: string; color: string};
};

class Section extends React.Component<SectionProps> {
    render(): JSX.Element {
        const {title, icon, theme, children} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.section}>
                <View style={styles.sectionTitleContainer}>
                    {icon && <MaterialIcons name={icon.name} color={icon.color} style={styles.sectionIcon} />}
                    <Text style={styles.sectionTitle}>{title}</Text>
                </View>
                {children}
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        scroll: {
            flex: 1,
            width: "100%",
        },
        container: {
            width: "100%",
            maxWidth: 700,
            alignSelf: "center",
            paddingTop: 10,
            paddingBottom: 50,
            paddingHorizontal: 20,
        },
        section: {
            paddingVertical: 10,
            justifyContent: "flex-start",
        },
        sectionTitleContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
        },
        sectionTitle: {
            textTransform: "uppercase",
            letterSpacing: 1,
            fontSize: 11,
            color: theme.textLight,
        },
        sectionIcon: {
            fontSize: 16,
            marginRight: 5,
        },
        card: {
            marginVertical: 6,
        },
        cardIcon: {
            marginRight: 6,
            padding: 0,
            fontSize: 18,
            color: theme.textLight,
        },
        localeButton: {
            height: 30,
        },
        localButtonValue: {
            fontSize: 14,
            marginHorizontal: 10,
        },
        redActionButton: {
            backgroundColor: theme.error,
            borderRadius: 4,
            height: 40,
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
            elevation: 2,
        },
        deleteAccountText: {
            color: theme.textWhite,
            fontSize: 16,
        },
        logoutButton: {},
        logoutText: {
            color: theme.textWhite,
            fontSize: 16,
        },
        infoText: {
            color: theme.text,
            fontSize: 16,
        },
        logosContainer: {},
        logo: {
            marginTop: 30,
            width: "100%",
        },
        logoErasmus: {height: 40},
        logoSeaEuAround: {height: 60},
        logoJA: {height: 40},
        developedBy: {
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: 1,
            fontSize: 11,
            color: theme.textLight,
            marginTop: 40,
        },
    });
});

export default reduxConnector(withTheme(SettingsScreen));
