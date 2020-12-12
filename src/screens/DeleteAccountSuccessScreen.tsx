import * as React from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
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

type DeleteAccountSuccessScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;

// TODO implement
class DeleteAccountSuccessScreen extends React.Component<DeleteAccountSuccessScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <Text style={styles.successText}>{i18n.t("deleteAccount.success1")}</Text>
                    <Text style={styles.successText}>{i18n.t("deleteAccount.success2")}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => store.dispatch(logout())}>
                        <Text style={styles.buttonText}>{i18n.t("deleteAccount.leave")}</Text>
                        <MaterialCommunityIcons name="logout" style={styles.buttonIcon} />
                    </TouchableOpacity>
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
            alignSelf: "center",
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
            height: 50,
            paddingHorizontal: 25,
            borderRadius: 8,
            marginTop: 40,
            backgroundColor: theme.error,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",

            shadowColor: "#000",
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
        },
        buttonText: {
            fontSize: 18,
            color: theme.textWhite,
        },
        buttonIcon: {
            fontSize: 20,
            color: theme.textWhite,
            marginLeft: 4,
        },
    });
});

export default withTheme(DeleteAccountSuccessScreen);
