import * as React from "react";
import {Text, View, StyleSheet} from "react-native";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {FontAwesome} from "@expo/vector-icons";
import i18n from "i18n-js";

type ForgotPasswordEmailSentScreenProps = ThemeProps;

class ForgotPasswordEmailSentScreen extends React.Component<ForgotPasswordEmailSentScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <FontAwesome name="envelope-o" style={styles.mailIcon}></FontAwesome>
                    <Text style={styles.description}>{i18n.t("resetPassword.instructions")}</Text>
                </View>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: theme.background,
        },
        wrapper: {
            width: "70%",
            alignItems: "center",
        },
        description: {
            fontSize: 16,
            textAlign: "center",
            color: theme.text,
        },
        mailIcon: {
            marginVertical: 30,
            fontSize: 50,
            color: theme.text,
        },
    });
});

export default withTheme(ForgotPasswordEmailSentScreen);
