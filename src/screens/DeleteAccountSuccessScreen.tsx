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
import {formStyles} from "../styles/forms";

type DeleteAccountSuccessScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;

// TODO implement
class DeleteAccountSuccessScreen extends React.Component<DeleteAccountSuccessScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);
        const fstyles = formStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <Text style={styles.successText}>{i18n.t("deleteAccount.success1")}</Text>
                    <Text style={styles.successText}>{i18n.t("deleteAccount.success2")}</Text>
                    <TouchableOpacity
                        style={[fstyles.buttonMajor, styles.button]}
                        onPress={() => store.dispatch(logout())}
                    >
                        <Text style={fstyles.buttonMajorText}>{i18n.t("deleteAccount.leave")}</Text>
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
            paddingHorizontal: 25,
            marginTop: 40,
            backgroundColor: theme.error,
            alignItems: "center",
            flexDirection: "row",
        },
        buttonIcon: {
            fontSize: 20,
            color: theme.textWhite,
            marginLeft: 4,
        },
    });
});

export default withTheme(DeleteAccountSuccessScreen);
