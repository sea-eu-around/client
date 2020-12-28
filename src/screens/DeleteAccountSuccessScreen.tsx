import * as React from "react";
import {Text, View, StyleSheet} from "react-native";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {StackScreenProps} from "@react-navigation/stack";
import {RootNavigatorScreens} from "../navigation/types";
import store from "../state/store";
import {logout} from "../state/auth/actions";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import ScreenWrapper from "./ScreenWrapper";
import Button from "../components/Button";

type DeleteAccountSuccessScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;

class DeleteAccountSuccessScreen extends React.Component<DeleteAccountSuccessScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <Text style={styles.successText}>{i18n.t("deleteAccount.success1")}</Text>
                    <Text style={styles.successText}>{i18n.t("deleteAccount.success2")}</Text>
                    <Button
                        text={i18n.t("deleteAccount.leave")}
                        icon={<MaterialCommunityIcons name="logout" style={styles.buttonIcon} />}
                        onPress={() => store.dispatch(logout())}
                        skin="rounded-filled"
                        style={styles.button}
                    />
                </View>
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "75%",
        },
        successText: {
            fontSize: 18,
            lineHeight: 25,
            marginTop: 20,
            textAlign: "center",
            color: theme.text,
        },
        button: {
            marginTop: 30,
            backgroundColor: theme.error,
        },
        buttonIcon: {
            fontSize: 20,
            color: theme.textWhite,
            marginLeft: 5,
        },
    });
});

export default withTheme(DeleteAccountSuccessScreen);
