import * as React from "react";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {RootNavigatorScreens} from "../navigation/types";
import {StackScreenProps} from "@react-navigation/stack";
import DeleteAccountForm from "../components/forms/DeleteAccountForm";
import ScreenWrapper from "./ScreenWrapper";
import ScrollFormWrapper from "../components/forms/ScrollFormWrapper";

type DeleteAccountScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;

class DeleteAccountScreen extends React.Component<DeleteAccountScreenProps> {
    render(): JSX.Element {
        return (
            <ScreenWrapper>
                <ScrollFormWrapper>
                    <DeleteAccountForm />
                </ScrollFormWrapper>
            </ScreenWrapper>
        );
    }
}

export default withTheme(DeleteAccountScreen);
