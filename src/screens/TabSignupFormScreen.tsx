import * as React from "react";
import {View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {connect, ConnectedProps} from "react-redux";
import SignupForm from "../components/forms/SignupForm";
import {loginTabsStyles} from "../styles/forms";
import {rootNavigate} from "../navigation/utils";

const mapStateToProps = (state: AppState) => ({
    theme: themes[state.theming.theme],
    registerSuccess: state.auth.registerSuccess,
});
const reduxConnector = connect(mapStateToProps);

type SignupFormProps = ConnectedProps<typeof reduxConnector>;

class SignupTabComponent extends React.Component<SignupFormProps> {
    componentDidUpdate() {
        if (this.props.registerSuccess) {
            rootNavigate("ValidationEmailSentScreen");
        }
    }

    render(): JSX.Element {
        const {theme} = this.props;
        return (
            <ScrollView contentContainerStyle={{paddingVertical: 50, backgroundColor: theme.background}}>
                <View style={[loginTabsStyles.container]}>
                    <View style={loginTabsStyles.formWrapper}>
                        <SignupForm />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default reduxConnector(SignupTabComponent);
