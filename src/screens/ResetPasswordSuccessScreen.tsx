import * as React from "react";
import {Text, View, StyleSheet} from "react-native";
import {rootNavigate} from "../navigation/utils";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {StackScreenProps} from "@react-navigation/stack";
import {RootNavigatorScreens} from "../navigation/types";

type ResetPasswordSuccessScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;

class ResetPasswordSuccessScreen extends React.Component<ResetPasswordSuccessScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <Text style={styles.successText}>
                        {i18n.t("resetPassword.success")[0]}
                        <Text onPress={() => rootNavigate("TabSignin")} style={{color: theme.accent}}>
                            {i18n.t("resetPassword.success")[1]}
                        </Text>
                    </Text>
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
        },
        title: {
            fontSize: 20,
            marginVertical: 20,
            textAlign: "center",
            color: theme.text,
        },
        successText: {
            fontSize: 18,
            lineHeight: 40,
            textAlign: "center",
            color: theme.text,
        },
    });
});

export default withTheme(ResetPasswordSuccessScreen);
