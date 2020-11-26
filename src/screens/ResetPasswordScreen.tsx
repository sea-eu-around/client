import * as React from "react";
import {View, KeyboardAvoidingView} from "react-native";
import {loginTabsStyles} from "../styles/forms";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import {RootNavigatorScreens} from "../navigation/types";
import {StackScreenProps} from "@react-navigation/stack";

type ResetPasswordScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;
type ResetPasswordScreenState = {token?: string};

class ResetPasswordScreen extends React.Component<ResetPasswordScreenProps, ResetPasswordScreenState> {
    constructor(props: ResetPasswordScreenProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // Attempt to extract a token out of the route parameters
        const params = this.props.route.params as {[key: string]: string};
        if (params && params.token) this.setState({...this.state, token: params.token});
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const {token} = this.state;
        const styles = loginTabsStyles(theme);

        return (
            <KeyboardAvoidingView behavior="height" style={styles.container}>
                <View style={styles.formWrapper}>
                    <ResetPasswordForm token={token} />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

export default withTheme(ResetPasswordScreen);
