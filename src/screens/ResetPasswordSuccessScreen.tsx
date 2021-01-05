import * as React from "react";
import {Text, View, StyleSheet} from "react-native";
import {rootNavigate} from "../navigation/utils";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {StackScreenProps} from "@react-navigation/stack";
import {RootNavigatorScreens} from "../navigation/types";
import ScreenWrapper from "./ScreenWrapper";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import Button from "../components/Button";

type ResetPasswordSuccessScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;

class ResetPasswordSuccessScreen extends React.Component<ResetPasswordSuccessScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <Text style={styles.successText}>{i18n.t("resetPassword.success")}</Text>
                    <Button
                        text={i18n.t("login")}
                        icon={<MaterialCommunityIcons name="login" style={styles.buttonIcon} />}
                        onPress={() => {
                            rootNavigate("LoginRoot", {
                                screen: "LoginScreens",
                                params: {screen: "SigninScreen"},
                            });
                        }}
                        skin="rounded-filled"
                        style={styles.button}
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
            justifyContent: "center",
            alignItems: "center",
            width: "75%",
        },
        successText: {
            fontSize: 18,
            lineHeight: 40,
            textAlign: "center",
            color: theme.text,
        },
        button: {
            marginTop: 30,
        },
        buttonIcon: {
            fontSize: 20,
            color: theme.textWhite,
            marginLeft: 4,
        },
    });
});

export default withTheme(ResetPasswordSuccessScreen);
