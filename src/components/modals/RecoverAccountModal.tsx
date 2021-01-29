import React from "react";
import {Text, View, StyleSheet} from "react-native";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import CustomModal, {CustomModalProps} from "./CustomModal";
import Button from "../Button";
import store from "../../state/store";
import {cancelLoginRecovery, requestLogin} from "../../state/auth/actions";
import {MyThunkDispatch} from "../../state/types";

export type RecoverAccountModalProps = ThemeProps & Partial<CustomModalProps> & {email: string; password: string};

class RecoverAccountModal extends React.Component<RecoverAccountModalProps> {
    render() {
        const {theme, email, password, ...otherProps} = this.props;
        const styles = themedStyles(theme);

        return (
            <CustomModal
                {...otherProps}
                modalViewStyle={styles.modal}
                renderContent={() => (
                    <>
                        <Text style={styles.title}>{i18n.t("recoverAccount.title")}</Text>
                        <Text style={styles.text}>{i18n.t("recoverAccount.text")}</Text>
                        <View style={styles.actionButtonsWrapper}>
                            <Button
                                text={i18n.t("cancel")}
                                onPress={() => store.dispatch(cancelLoginRecovery())}
                                skin="rounded-hollow"
                                style={styles.actionButton}
                                textStyle={styles.actionText}
                            />
                            <Button
                                text={i18n.t("recoverAccount.yes")}
                                onPress={() => {
                                    (store.dispatch as MyThunkDispatch)(requestLogin(email, password, true));
                                }}
                                skin="rounded-filled"
                                style={[styles.actionButton, styles.redBackground]}
                                textStyle={styles.actionText}
                            />
                        </View>
                    </>
                )}
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        modal: {
            paddingHorizontal: 20,
            paddingVertical: 20,
        },
        title: {
            fontSize: 20,
            textAlign: "left",
            width: "100%",
            marginBottom: 10,
            fontWeight: "bold",
        },
        text: {
            fontSize: 16,
            textAlign: "justify",
        },

        actionButtonsWrapper: {
            width: "100%",
            flexDirection: "row",
            marginTop: 20,
        },
        actionButton: {
            flex: 1,
            marginHorizontal: 10,
            marginVertical: 0,
        },
        actionText: {
            fontSize: 16,
        },
        redBackground: {
            backgroundColor: theme.error,
        },
    });
});

export default withTheme(RecoverAccountModal);
