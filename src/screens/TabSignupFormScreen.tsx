import * as React from "react";
import {KeyboardAvoidingView, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import SignupForm from "../components/forms/SignupForm";
import {loginTabsStyles} from "../styles/forms";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";

type SignupFormProps = ThemeProps;

class SignupTabComponent extends React.Component<SignupFormProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = loginTabsStyles(theme);

        return (
            <ScrollView
                contentContainerStyle={{paddingVertical: 50, backgroundColor: theme.background}}
                keyboardShouldPersistTaps={"always"}
            >
                <View style={styles.container}>
                    <View style={styles.formWrapper}>
                        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
                            <SignupForm />
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default withTheme(SignupTabComponent);
