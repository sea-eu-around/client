import * as React from "react";
import {View} from "react-native";
import SignupForm from "../components/forms/SignupForm";
import {loginTabsStyles} from "../styles/forms";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";
import ScrollFormWrapper from "../components/forms/ScrollFormWrapper";
import ScreenWrapper from "./ScreenWrapper";

type SignupFormProps = ThemeProps;

class SignupTabComponent extends React.Component<SignupFormProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = loginTabsStyles(theme);

        /*return (
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
        );*/
        return (
            <ScreenWrapper>
                <ScrollFormWrapper>
                    <View style={styles.formContainer}>
                        <SignupForm />
                    </View>
                </ScrollFormWrapper>
            </ScreenWrapper>
        );
    }
}

export default withTheme(SignupTabComponent);
