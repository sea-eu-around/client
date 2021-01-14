import * as React from "react";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import {RootNavigatorScreens} from "../navigation/types";
import {StackScreenProps} from "@react-navigation/stack";
import ScreenWrapper from "./ScreenWrapper";
import ScrollFormWrapper from "../components/forms/ScrollFormWrapper";

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
        const {token} = this.state;

        return (
            <ScreenWrapper>
                <ScrollFormWrapper>
                    <ResetPasswordForm token={token} containerStyle={{width: "80%", maxWidth: 400}} />
                </ScrollFormWrapper>
            </ScreenWrapper>
        );
    }
}

export default withTheme(ResetPasswordScreen);
