import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {withTheme} from "react-native-elements";
import {TouchableOpacity} from "react-native-gesture-handler";
import {rootNavigate} from "../navigation/utils";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";

export type TabNotImplementedScreenProps = ThemeProps;

class ReciprocalMatchScreen extends React.Component<TabNotImplementedScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{i18n.t("matching.success.title")}</Text>
                <View style={styles.separator} />
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => rootNavigate("TabMessaging") /* TODO Redirect to chat tab directly instead */}
                >
                    <Text style={styles.actionText}>{i18n.t("matching.success.chat")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, {backgroundColor: theme.actionNeutral}]}
                    onPress={() => rootNavigate("TabMatchingScreen")}
                >
                    <Text style={styles.actionText}>{i18n.t("matching.success.continue")}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.okay,
        },
        title: {
            width: "100%",
            textAlign: "center",
            fontFamily: "sans-serif-thin",
            fontSize: 32,
            color: theme.text,
            letterSpacing: 1,
            textTransform: "uppercase",
        },
        separator: {
            marginVertical: 30,
            height: 1,
            width: "80%",
            backgroundColor: theme.cardBackground,
            opacity: 0.3,
        },
        actionButton: {
            backgroundColor: theme.accent,
            paddingHorizontal: 30,
            paddingVertical: 10,
            marginVertical: 20,
            borderRadius: 20,
        },
        actionText: {
            color: theme.textWhite,
            fontSize: 18,
            letterSpacing: 1,
            textTransform: "uppercase",
        },
    });
});

export default withTheme(ReciprocalMatchScreen);
