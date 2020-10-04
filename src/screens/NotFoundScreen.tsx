import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import i18n from "i18n-js";
import {RootNavigatorScreens} from "../navigation/types";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 64,
        fontWeight: "100",
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 50,
    },
    link: {
        paddingVertical: 10,
    },
    linkText: {
        fontSize: 14,
        color: "#2e78b7",
    },
});

export default function NotFoundScreen({
    navigation,
}: StackScreenProps<RootNavigatorScreens, "NotFoundScreen">): JSX.Element {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{i18n.t("pageNotFound")}</Text>
            <Text style={styles.subtitle}>{i18n.t("pageDoesntExist")}</Text>
            <TouchableOpacity onPress={() => navigation.replace("LoginScreen")} style={styles.link}>
                <Text style={styles.linkText}>{i18n.t("goHome")}</Text>
            </TouchableOpacity>
        </View>
    );
}
