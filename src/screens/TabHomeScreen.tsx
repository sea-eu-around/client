import {FontAwesome} from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as React from "react";
import {Platform, StyleSheet, Text, View} from "react-native";
import {withTheme} from "react-native-elements";
import LogOutButton from "../components/LogOutButton";
import {styleTextLight} from "../styles/general";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import ScreenWrapper from "./ScreenWrapper";
import {MyThunkDispatch} from "../state/types";

export type TabNotImplementedScreenProps = ThemeProps;

class TabNotImplementedScreen extends React.Component<TabNotImplementedScreenProps> {
    registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
            const {status: existingStatus} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }
            if (finalStatus !== "granted") {
                alert("Failed to get push token for push notification!");
                return;
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;

            console.log(token);
        } else {
            alert("Must use physical device for Push Notifications");
        }

        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }
    };

    componentDidMount() {
        this.registerForPushNotificationsAsync();
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
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

export default withTheme(TabNotImplementedScreen);
