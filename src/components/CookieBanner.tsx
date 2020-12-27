import React from "react";
import {Text, StyleSheet, View, TouchableOpacity} from "react-native";
import {withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {acceptAllCookies} from "../state/settings/actions";
import store from "../state/store";
import {AppState, MyThunkDispatch} from "../state/types";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import CustomModal from "./modals/CustomModal";
import i18n from "i18n-js";
import CustomizeCookiesModal from "./modals/CustomizeCookiesModal";
import {hasUserGivenCookieConsent} from "../state/static-storage-middleware";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    cookies: state.settings.userSettings.cookies,
    consentDate: state.settings.userSettings.cookieConsentDate,
}));

// Component props
export type CookieBannerProps = ThemeProps & ConnectedProps<typeof reduxConnector>;

// Component state
export type CookieBannerState = {showCustomize: boolean};

class CookieBanner extends React.Component<CookieBannerProps, CookieBannerState> {
    constructor(props: CookieBannerProps) {
        super(props);
        this.state = {showCustomize: false};
    }

    render(): JSX.Element {
        const {theme, consentDate} = this.props;
        const {showCustomize} = this.state;

        const styles = themedStyles(theme);

        if (hasUserGivenCookieConsent(consentDate)) return <></>;

        return (
            <>
                <CustomModal
                    visible={!showCustomize}
                    animationType="slide"
                    fullWidth
                    bottom
                    nonDismissable={true}
                    modalViewStyle={styles.modalView}
                    renderContent={() => (
                        <>
                            <Text style={styles.cookieText}>{i18n.t("cookies.bannerText")}</Text>
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={[styles.action, styles.actionFilled]}
                                    onPress={() => (store.dispatch as MyThunkDispatch)(acceptAllCookies())}
                                >
                                    <Text style={[styles.actionText, styles.actionTextFilled]}>
                                        {i18n.t("cookies.acceptAll")}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.action]}
                                    onPress={() => this.setState({...this.state, showCustomize: true})}
                                >
                                    <Text style={styles.actionText}>{i18n.t("cookies.customize")}</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                />
                <CustomizeCookiesModal
                    visible={showCustomize}
                    onHide={() => this.setState({...this.state, showCustomize: false})}
                />
            </>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        modalView: {
            paddingHorizontal: 20,
            paddingVertical: 20,
            justifyContent: "center",
        },
        cookieText: {
            fontSize: 14,
            lineHeight: 20,
            color: theme.text,
            textAlign: "justify",
        },
        actions: {
            flexDirection: "row",
            marginTop: 20,
            width: "100%",
            maxWidth: 350,
        },
        // TODO General actions styles
        action: {
            flex: 1,
            height: 40,
            marginHorizontal: 10,

            justifyContent: "center",
            alignItems: "center",

            borderColor: theme.accent,
            borderWidth: 1,
            borderRadius: 40,
        },
        actionFilled: {
            backgroundColor: theme.accent,
        },
        actionText: {
            fontSize: 16,
            color: theme.accent,
        },
        actionTextFilled: {
            color: theme.textWhite,
        },
    });
});

export default reduxConnector(withTheme(CookieBanner));
