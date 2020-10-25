import {FontAwesome, MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import themes from "../constants/themes";
import {AppState} from "../state/types";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
    },
    topBar: {
        flexBasis: 90,
        paddingTop: 40,
        paddingHorizontal: 20,
        width: "100%",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 20,
        height: 1,
        width: "100%",
    },
    scroller: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    matchContainer: {
        flex: 1,
        borderStyle: "solid",
        borderColor: "red",
        borderWidth: 1,
    },
});

const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
});
const reduxConnector = connect(mapStateToProps);

type MatchFilteringScreenProps = ConnectedProps<typeof reduxConnector>;

class MatchFilteringScreen extends React.Component<MatchFilteringScreenProps> {
    render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Text>temp</Text>
            </View>
        );
    }
}

export default reduxConnector(MatchFilteringScreen);
