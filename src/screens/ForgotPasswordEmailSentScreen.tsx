import * as React from "react";
import {Text, View, StyleSheet} from "react-native";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {FontAwesome} from "@expo/vector-icons";
import i18n from "i18n-js";
import ScreenWrapper from "./ScreenWrapper";

type ForgotPasswordEmailSentScreenProps = ThemeProps;

class ForgotPasswordEmailSentScreen extends React.Component<ForgotPasswordEmailSentScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <FontAwesome name="envelope-o" style={styles.mailIcon}></FontAwesome>
                    <Text style={styles.description}>{i18n.t("resetPassword.instructions")}</Text>
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
