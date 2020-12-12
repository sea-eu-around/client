import * as React from "react";
import SignupForm from "../components/forms/SignupForm";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";
import ScrollFormWrapper from "../components/forms/ScrollFormWrapper";
import ScreenWrapper from "./ScreenWrapper";

type SignupFormProps = ThemeProps;

class SignupTabComponent extends React.Component<SignupFormProps> {
    render(): JSX.Element {
        return (
            <ScreenWrapper>
                <ScrollFormWrapper>
                    <SignupForm />
                </ScrollFormWrapper>
            </ScreenWrapper>
        );
    }
}

export default withTheme(SignupTabComponent);
