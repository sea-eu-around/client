import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {withTheme} from "react-native-elements";
import LogOutButton from "../components/LogOutButton";
import {styleTextLight} from "../styles/general";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";

export type TabNotImplementedScreenProps = ThemeProps;

class TabNotImplementedScreen extends React.Component<TabNotImplementedScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.container}>
                <FontAwesome style={styles.icon} name="heart" />
                <Text style={styles.title}>Thank you for participating in the alpha program.</Text>
                <View style={styles.separator} />
                <Text style={[styles.alphaText, {fontWeight: "bold"}]}>
                    Found a bug or have some feedback for us or ideas for the app?
                </Text>
                <Text style={styles.alphaText}>
                    Get in touch with us on Slack and we would be happy to discuss it with you!
                </Text>
                <LogOutButton style={styles.logoutButton} />
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            padding: 50,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.background,
        },
        title: {
            width: "100%",
            textAlign: "center",
            fontSize: 24,
            color: theme.text,
            ...styleTextLight,
        },
        alphaText: {
            width: "100%",
            textAlign: "left",
            fontSize: 16,
            color: theme.text,
            marginVertical: 10,
        },
        icon: {
            color: theme.accent,
            fontSize: 48,
            paddingBottom: 20,
        },
        separator: {
            marginVertical: 30,
            height: 1,
            opacity: 0.1,
            width: "100%",
            backgroundColor: theme.text,
        },
        logoutButton: {
            marginTop: 80,
        },
    });
});

export default withTheme(TabNotImplementedScreen);
