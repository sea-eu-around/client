import * as React from "react";
import {View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {SignupTabNavigatorScreens} from "../types";
import {ScrollView} from "react-native-gesture-handler";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {connect, ConnectedProps} from "react-redux";
import SignupForm from "../components/SignupForm";
import {loginTabsStyles} from "../styles/forms";

const mapStateToProps = (state: AppState) => ({
    theme: themes[state.theming.theme],
});
const reduxConnector = connect(mapStateToProps);

type SignupFormProps = ConnectedProps<typeof reduxConnector> &
    StackScreenProps<SignupTabNavigatorScreens, "SignupForm">;

function SignupTabComponent({theme}: SignupFormProps): JSX.Element {
    return (
        <ScrollView contentContainerStyle={{paddingVertical: 50, backgroundColor: theme.background}}>
            <View style={[loginTabsStyles.container]}>
                <View style={loginTabsStyles.formWrapper}>
                    <SignupForm></SignupForm>
                </View>
            </View>
        </ScrollView>
    );
}

export default reduxConnector(SignupTabComponent);
