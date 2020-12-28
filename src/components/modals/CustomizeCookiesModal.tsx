import React from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import CustomModal from "./CustomModal";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../../types";
import {CheckBox, withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {AppState} from "../../state/types";
import store from "../../state/store";
import {CookiesPreferences, COOKIES_PREFERENCES_KEYS} from "../../model/user-settings";
import {connect, ConnectedProps} from "react-redux";
import {saveCookiesPreferences} from "../../state/settings/actions";
import {CustomModalProps} from "./CustomModal.native";
import Button from "../Button";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    cookies: state.settings.userSettings.cookies,
}));

// Component props
export type CustomizeCookiesModalProps = ThemeProps & Partial<CustomModalProps> & ConnectedProps<typeof reduxConnector>;

// Component state
export type CustomizeCookiesModalState = {cookies: CookiesPreferences};

class CustomizeCookiesModal extends React.Component<CustomizeCookiesModalProps, CustomizeCookiesModalState> {
    constructor(props: CustomizeCookiesModalProps) {
        super(props);
        this.state = {cookies: props.cookies};
    }

    private onShow(): void {
        const storeCookies = this.props.cookies as {[key: string]: boolean};
        const localCookies = this.state.cookies as {[key: string]: boolean};

        // Update component cookies state with the state from the store if it is different
        const changed = Object.keys(storeCookies).some((key: string) => storeCookies[key] != localCookies[key]);
        if (changed) this.setState({...this.state, cookies: this.props.cookies});
    }

    render(): JSX.Element {
        const {theme, ...otherProps} = this.props;
        const {cookies} = this.state;
        const styles = themedStyles(theme);

        const cookieDict = this.state.cookies as {[key: string]: boolean};

        const toggleCookie = (key: string) =>
            this.setState({...this.state, cookies: {...cookies, [key]: !cookieDict[key]}});

        return (
            <CustomModal
                {...otherProps}
                modalViewStyle={[{paddingHorizontal: 20, alignItems: "flex-start"}, otherProps.modalViewStyle]}
                onShow={() => {
                    this.onShow();
                    if (otherProps.onShow) otherProps.onShow();
                }}
                renderContent={(hide: () => void) => (
                    <>
                        <Text style={styles.title}>Cookies</Text>
                        <Text style={styles.text}>
                            We offer you the ability to choose what information will be stored on your device when using
                            SEA-EU Around.
                        </Text>
                        {COOKIES_PREFERENCES_KEYS.map((k) => (
                            <View style={styles.preferenceRow} key={`cookie-preference-${k}`}>
                                <TouchableOpacity style={styles.preferenceRowButton} onPress={() => toggleCookie(k)}>
                                    <CheckBox
                                        checked={cookieDict[k]}
                                        containerStyle={styles.checkBoxContainer}
                                        onPress={() => toggleCookie(k)}
                                    />
                                    <Text style={styles.preferenceName}>{i18n.t(`cookies.preferences.${k}.name`)}</Text>
                                </TouchableOpacity>
                                <Text style={styles.preferenceDescription}>
                                    {i18n.t(`cookies.preferences.${k}.description`)}
                                </Text>
                            </View>
                        ))}
                        <View style={styles.actions}>
                            <Button
                                text={i18n.t("save")}
                                onPress={() => {
                                    hide();
                                    store.dispatch(saveCookiesPreferences(cookies));
                                }}
                                skin="rounded-filled"
                                textStyle={styles.buttonText}
                                style={styles.button}
                            />
                            <Button
                                text={i18n.t("cancel")}
                                onPress={() => {
                                    hide();
                                    this.setState({...this.state, cookies: this.props.cookies});
                                }}
                                skin="rounded-hollow"
                                textStyle={styles.buttonText}
                                style={styles.button}
                            />
                        </View>
                    </>
                )}
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        title: {
            fontSize: 20,
            textAlign: "left",
            marginBottom: 10,
            color: theme.text,
        },
        text: {
            fontSize: 14,
            lineHeight: 18,
            textAlign: "justify",
            color: theme.text,
        },

        preferenceRow: {
            marginTop: 10,
        },
        preferenceRowButton: {
            flexDirection: "row",
            alignItems: "center",
        },
        checkBoxContainer: {
            marginLeft: 0,
            marginRight: 5,
            paddingLeft: 0,
            paddingRight: 0,
            paddingVertical: 0,
        },
        preferenceName: {
            fontSize: 16,
            color: theme.text,
        },
        preferenceDescription: {
            fontSize: 14,
            color: theme.textLight,
        },

        actions: {
            flexDirection: "row",
            marginTop: 20,
            width: "100%",
            maxWidth: 350,
        },
        button: {
            flex: 1,
            height: 40,
            marginHorizontal: 10,
            marginVertical: 0,
        },
        buttonText: {
            fontSize: 16,
        },
    });
});

export default reduxConnector(withTheme(CustomizeCookiesModal));
