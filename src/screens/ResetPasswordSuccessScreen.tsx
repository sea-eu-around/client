import * as React from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {rootNavigate} from "../navigation/utils";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {StackScreenProps} from "@react-navigation/stack";
import {RootNavigatorScreens} from "../navigation/types";
import ScreenWrapper from "./ScreenWrapper";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {formStyles} from "../styles/forms";

type ResetPasswordSuccessScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;

class ResetPasswordSuccessScreen extends React.Component<ResetPasswordSuccessScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);
        const fstyles = formStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <Text style={styles.successText}>{i18n.t("resetPassword.success")}</Text>
                    <TouchableOpacity
                        style={[fstyles.buttonMajor, styles.button]}
                        onPress={() => rootNavigate("LoginScreen")}
                    >
                        <Text style={fstyles.buttonMajorText}>{i18n.t("login")}</Text>
                        <MaterialCommunityIcons name="login" style={styles.buttonIcon} />
                    </TouchableOpacity>
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
            paddingHorizontal: 25,
            marginTop: 20,
            backgroundColor: theme.accent,
            alignItems: "center",
            flexDirection: "row",
        },
        buttonIcon: {
            fontSize: 20,
            color: theme.textWhite,
            marginLeft: 4,
        },
    });
});

export default withTheme(ResetPasswordSuccessScreen);
