import React from "react";
import {Text, TouchableHighlight, View, StyleSheet} from "react-native";
import CustomModal, {CustomModalProps} from "./CustomModal";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {UserProfile} from "../../model/user-profile";

export type BlockProfileModalProps = ThemeProps &
    Partial<CustomModalProps> & {onBlock: () => void; profile: UserProfile};

class BlockProfileModal extends React.Component<BlockProfileModalProps> {
    render() {
        const {theme, profile, onBlock, ...otherProps} = this.props;
        const styles = themedStyles(theme);
        return (
            <CustomModal
                {...otherProps}
                renderContent={(hide: () => void) => (
                    <>
                        <Text style={styles.text}>
                            {i18n.t("block.warning", {firstname: profile.firstName, lastname: profile.lastName})}
                        </Text>
                        <View style={styles.actionButtonsWrapper}>
                            <TouchableHighlight
                                style={[styles.actionButton, styles.actionButtonCancel]}
                                onPress={() => hide()}
                            >
                                <Text style={styles.actionText}>{i18n.t("cancel")}</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={[styles.actionButton, styles.actionButtonDecline]}
                                onPress={() => {
                                    hide();
                                    if (onBlock) onBlock();
                                }}
                            >
                                <Text style={styles.actionText}>{i18n.t("block.action")}</Text>
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
            color: theme.textWhite,
        },
        text: {
            fontSize: 16,
            textAlign: "justify",
            color: theme.text,
        },
    });
});

export default withTheme(BlockProfileModal);
