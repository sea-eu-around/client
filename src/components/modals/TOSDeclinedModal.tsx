import React from "react";
import {Text, TouchableHighlight, View, StyleSheet} from "react-native";
import {rootNavigate} from "../../navigation/utils";
import CustomModal, {CustomModalProps} from "./CustomModal";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";

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
                            <TouchableHighlight
                                style={[styles.actionButton, styles.actionButtonCancel]}
                                onPress={() => hide()}
                            >
                                <Text style={[styles.actionText]}>{i18n.t("cancel")}</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={[styles.actionButton, styles.actionButtonDecline]}
                                onPress={() => {
                                    hide();
                                    rootNavigate("LoginScreen");
                                }}
                            >
                                <Text style={styles.actionText}>{i18n.t("legal.decline")}</Text>
                            </TouchableHighlight>
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
            justifyContent: "space-evenly",
        },
        actionButton: {
            width: 110,
            maxWidth: "40%",
            borderRadius: 3,
            paddingVertical: 10,
            elevation: 2,
        },
        actionButtonCancel: {
            backgroundColor: theme.accentSecondary,
        },
        actionButtonDecline: {
            backgroundColor: theme.error,
        },
        actionText: {
            fontWeight: "bold",
            textAlign: "center",
            color: theme.textInverted,
        },
        text: {
            fontSize: 16,
            textAlign: "justify",
        },
    });
});

export default withTheme(TOSDeclinedModal);
