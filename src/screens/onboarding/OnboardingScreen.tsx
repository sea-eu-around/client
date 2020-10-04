import {MaterialTopTabScreenProps} from "@react-navigation/material-top-tabs";
import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {Text, View, StyleSheet} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import {connect, ConnectedProps} from "react-redux";
import {ONBOARDING_ORDER} from ".";
import themes from "../../constants/themes";
import {OnboardingScreens} from "../../navigation/types";
import {AppState} from "../../state/types";

const mapStateToProps = (state: AppState) => ({
    theme: themes[state.theming.theme],
});
const reduxConnector = connect(mapStateToProps);

export type OnboardingScreenProps = {
    title: string;
    index: number;
} & ConnectedProps<typeof reduxConnector> &
    MaterialTopTabScreenProps<OnboardingScreens>;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    wrapper: {
        width: "70%",
    },
    title: {
        fontSize: 20,
        marginVertical: 20,
        textAlign: "center",
    },
    okButton: {
        height: 50,
        marginVertical: 20,
    },
});

class OnboardingScreen extends React.Component<OnboardingScreenProps> {
    render(): JSX.Element {
        const {title, index} = this.props;

        const order = ONBOARDING_ORDER;
        const previous = index == 0 ? null : order[index - 1];
        const next = index == order.length - 1 ? null : order[index + 1];

        return (
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <Text style={styles.title}>onboarding - {title}</Text>
                    {previous && (
                        <TouchableOpacity onPress={() => this.props.navigation.navigate(previous)}>
                            <Text>← previous</Text>
                        </TouchableOpacity>
                    )}
                    {next && (
                        <TouchableOpacity onPress={() => this.props.navigation.navigate(next)}>
                            <Text>next →</Text>
                        </TouchableOpacity>
                    )}
                    {this.props.children}
                </View>
            </View>
        );
    }
}

export default reduxConnector(OnboardingScreen);
