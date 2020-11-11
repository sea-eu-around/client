import * as React from "react";
import {View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {connect, ConnectedProps} from "react-redux";
import SignupForm from "../components/forms/SignupForm";
import {loginTabsStyles} from "../styles/forms";

const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
});
const reduxConnector = connect(mapStateToProps);

type SignupFormProps = ConnectedProps<typeof reduxConnector>;

class SignupTabComponent extends React.Component<SignupFormProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = loginTabsStyles(theme);

        return (
            <ScrollView contentContainerStyle={{paddingVertical: 50, backgroundColor: theme.background}}>
                <View style={[styles.container]}>
                    <View style={styles.formWrapper}>
                        <SignupForm />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default reduxConnector(SignupTabComponent);
