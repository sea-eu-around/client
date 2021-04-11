import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";
import {StackScreenProps} from "@react-navigation/stack";
import {RootNavigatorScreens} from "../navigation/types";
import ScreenWrapper from "./ScreenWrapper";
import SemiHighlightedText from "../components/SemiHighlightedText";
import Button from "../components/Button";
import {MaterialIcons} from "@expo/vector-icons";
import {rootNavigate} from "../navigation/utils";
import AsyncButton from "../components/AsyncButton";
import {MyThunkDispatch} from "../state/types";
import {requestSendVerificationEmail} from "../state/auth/actions";
import store from "../state/store";

export type ResendVerifyEmailScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;

class ResendVerifyEmailScreen extends React.Component<ResendVerifyEmailScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);
        const dispatch = store.dispatch as MyThunkDispatch;

        return (
            <ScreenWrapper containerStyle={styles.container}>
                <View style={styles.topContainer}>
                    <SemiHighlightedText
                        text={i18n.t("resendVerifyScreen.title")}
                        fontSize={28}
                        textStyle={styles.title}
                    />
                    <Text style={styles.infoText}>{i18n.t("resendVerifyScreen.text")}</Text>
                </View>

                <View style={styles.actionsContainer}>
                    <AsyncButton
                        text={i18n.t("resendVerifyScreen.send")}
                        onPress={() => dispatch(requestSendVerificationEmail())}
                        skin="rounded-filled"
                        icon={
                            <MaterialIcons
                                name="mail-outline"
                                style={{color: theme.textWhite, fontSize: 24, marginLeft: 10}}
                            />
                        }
                    />
                    <Button
                        text={i18n.t("cancel")}
                        onPress={() =>
                            rootNavigate("LoginRoot", {
                                screen: "LoginScreens",
                                params: {screen: "SigninScreen"},
                            })
                        }
                        skin="rounded-hollow"
                    />
                </View>
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            maxWidth: "85%",
            justifyContent: "space-between",
            alignItems: "center",
        },
        topContainer: {
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
        title: {
            color: theme.themeAwareAccent,
            fontFamily: "RalewayBold",
        },
        infoText: {
            color: theme.themeAwareAccent,
            fontFamily: "RalewaySemiBold",
            fontSize: 18,
            lineHeight: 22,
            textAlign: "justify",
            marginTop: 25,
            maxWidth: 500,
        },
        actionsContainer: {
            width: "100%",
            maxWidth: 300,
            marginBottom: 30,
        },
    });
});

export default withTheme(ResendVerifyEmailScreen);
