import React from "react";
import {Text, View, StyleSheet} from "react-native";
import {rootNavigate} from "../../navigation/utils";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import CustomModal, {CustomModalProps} from "./CustomModal";
import Button from "../Button";

export type TOSDeclinedModalProps = ThemeProps & Partial<CustomModalProps>;

class TOSDeclinedModal extends React.Component<TOSDeclinedModalProps> {
    render() {
        const {theme, ...otherProps} = this.props;
        const styles = themedStyles(theme);

        return (
            <CustomModal
                {...otherProps}
                renderContent={(hide: () => void) => (
                    <>
                        <Text style={styles.text}>
                            {i18n.t("legal.modal.disclaimer1")}
                            {"\n\n"}
                            {i18n.t("legal.modal.disclaimer2")}
                        </Text>
                        <View style={styles.actionButtonsWrapper}>
                            <Button
                                text={i18n.t("cancel")}
                                onPress={() => hide()}
                                skin="rounded-hollow"
                                style={styles.actionButton}
                                textStyle={styles.actionText}
                            />
                            <Button
                                text={i18n.t("legal.decline")}
                                onPress={() => {
                                    hide();
                                    rootNavigate("LoginScreen");
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

        text: {
            fontSize: 16,
            textAlign: "justify",
        },
    });
});

export default withTheme(TOSDeclinedModal);
