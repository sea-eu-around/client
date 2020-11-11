import {FontAwesome5} from "@expo/vector-icons";
import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {withTheme} from "react-native-elements";
import LogOutButton from "../components/LogOutButton";
import {rootNavigate} from "../navigation/utils";
import {preTheme} from "../styles/utils";
import {ThemeProps} from "../types";

export type TabNotImplementedScreenProps = ThemeProps;

class TabNotImplementedScreen extends React.Component<TabNotImplementedScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.container}>
                <FontAwesome5 style={styles.constructionIcon} name="hard-hat"></FontAwesome5>
                <Text style={styles.title}>Under construction</Text>
                <View style={styles.separator} />
                <LogOutButton style={styles.logoutButton} onLogOut={() => rootNavigate("LoginScreen")} />
            </View>
        );
    }
}

const themedStyles = preTheme(() => {
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
        },
        constructionIcon: {
            color: "#eecc00",
            fontSize: 40,
        },
        separator: {
            marginVertical: 30,
            height: 1,
            width: "80%",
            backgroundColor: "#eee",
        },
        logoutButton: {
            marginVertical: 20,
        },
    });
});

export default withTheme(TabNotImplementedScreen);
