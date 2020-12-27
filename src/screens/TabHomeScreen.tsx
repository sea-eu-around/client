import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {withTheme} from "react-native-elements";
import LogOutButton from "../components/LogOutButton";
import {styleTextLight} from "../styles/general";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import ScreenWrapper from "./ScreenWrapper";

export type TabHomeScreenProps = ThemeProps;

class TabHomeScreen extends React.Component<TabHomeScreenProps> {
    private async fetchPostEmbed(shortCode: string): Promise<Response> {
        // seaEuAlliance profile ID: 32204624961
        // url=
        const BASE_URL = "https://graph.facebook.com/v9.0/instagram_oembed";
        const CLIENT_TOKEN = "80cd0bc3c132ad645a15d234ccd841bd";
        const POST_URL = `https://www.instagram.com/p/${shortCode}/`;
        const url = `${BASE_URL}?url=${POST_URL}&access_token=${CLIENT_TOKEN}`;

        const headers: {[key: string]: string} = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        console.log(url);
        const response = await fetch(url, {method: "GET", headers});
        return response;
    }

    fetchEmbed() {
        this.fetchPostEmbed("CJQ-ZX_rZb8").then((response) => console.log(JSON.stringify(response)));
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    {/*<TouchableOpacity onPress={() => this.fetchEmbed()}>
                        <Text style={{fontSize: 22, padding: 20}}>Fetch</Text>
                    </TouchableOpacity>*/}
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
            </ScreenWrapper>
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

export default withTheme(TabHomeScreen);
