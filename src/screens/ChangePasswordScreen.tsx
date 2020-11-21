import * as React from "react";
import {View, KeyboardAvoidingView} from "react-native";
import {loginTabsStyles} from "../styles/forms";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import ChangePasswordForm from "../components/forms/ChangePasswordForm";

type ChangePasswordScreenProps = ThemeProps;

class ChangePasswordScreen extends React.Component<ChangePasswordScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = loginTabsStyles(theme);

        return (
            <KeyboardAvoidingView behavior="height" style={styles.container}>
                <View style={styles.formWrapper}>
                    <ChangePasswordForm />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

export default withTheme(ChangePasswordScreen);
