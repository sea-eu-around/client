import {FontAwesome, MaterialIcons} from "@expo/vector-icons";
import {StackNavigationProp, StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import themes from "../constants/themes";
import {TabMatchingParamList} from "../navigation/types";
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

type TabMatchingScreenProps = ConnectedProps<typeof reduxConnector> &
    StackScreenProps<TabMatchingParamList, "TabMatchingScreen">;

class TabMatchingScreen extends React.Component<TabMatchingScreenProps> {
    render(): JSX.Element {
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.scroller}>
                    <View style={styles.matchContainer}>

                    </View>
                </View>
            </View>
        );
    }
}

export default reduxConnector(TabMatchingScreen);

/*

<View style={styles.container}>
    <View style={styles.topBar}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.title}>Matchingg</Text>
            <FontAwesome
                name="sliders"
                size={30}
                style={{paddingHorizontal: 4}}
                onPress={() => {
                    navigation.navigate("MatchFilteringScreen");
                }}
            />
        </View>
        <View style={[styles.separator, {backgroundColor: "#ccc"}]} />
    </View>
    <View style={styles.scroller}>
        <View style={styles.matchContainer}>

        </View>
    </View>
</View>

*/