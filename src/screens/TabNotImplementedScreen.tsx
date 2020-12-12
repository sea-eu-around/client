import {FontAwesome5} from "@expo/vector-icons";
import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {withTheme} from "react-native-elements";
import LogOutButton from "../components/LogOutButton";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import ScreenWrapper from "./ScreenWrapper";

export type TabNotImplementedScreenProps = ThemeProps;

class TabNotImplementedScreen extends React.Component<TabNotImplementedScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <FontAwesome5 style={styles.constructionIcon} name="hard-hat"></FontAwesome5>
                    <Text style={styles.title}>Under construction</Text>
                    <View style={styles.separator} />
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
            alignItems: "center",
            justifyContent: "center",
        },
        title: {
            width: "100%",
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            color: theme.text,
        },
        constructionIcon: {
            color: "#eecc00",
            fontSize: 40,
        },
        separator: {
            marginVertical: 30,
            height: 1,
            width: "80%",
            backgroundColor: theme.cardBackground,
        },
        logoutButton: {
            marginVertical: 20,
        },
    });
});

export default withTheme(TabNotImplementedScreen);
