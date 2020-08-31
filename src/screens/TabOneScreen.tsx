import * as React from "react";
import {StyleSheet, Text, View} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
});

export default function TabOneScreen(): JSX.Element {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adopt a Student - Tab One</Text>
            <View style={[styles.separator, {backgroundColor: "#eee"}]} />
        </View>
    );
}
