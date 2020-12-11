import * as React from "react";
import {View} from "react-native";
import {loginTabsStyles} from "../styles/forms";
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
        const {theme} = this.props;
        const styles = loginTabsStyles(theme);

        return (
            <ScreenWrapper>
                <ScrollFormWrapper>
                    <View style={styles.formContainer}>
                        <DeleteAccountForm />
                    </View>
                </ScrollFormWrapper>
            </ScreenWrapper>
        );
    }
}

export default withTheme(DeleteAccountScreen);
