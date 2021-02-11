import React from "react";
import {Text, View, StyleSheet, TextProps, TouchableOpacity} from "react-native";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import CustomModal, {CustomModalProps} from "./CustomModal";
import {IconProps} from "@expo/vector-icons/build/createIconSet";
import {styleTextLight} from "../../styles/general";

export type ConfirmationModalButtonPreset = "cancel" | "confirm" | "delete";

export type ConfirmationModalButton = {
    preset?: ConfirmationModalButtonPreset;
    text?: string;
    icon?: (props: Partial<IconProps<never>>) => JSX.Element;
    onPress?: (hide: () => void) => void;
    backgroundColor?: string;
    color?: string;
};

export type ConfirmationModalProps = ThemeProps &
    Partial<CustomModalProps> & {
        title: string;
        text?: string;
        justifyText?: boolean;
        icon?: (props: Partial<IconProps<never>>) => JSX.Element;
        additionalContent?: (hide: () => void, textProps: TextProps) => JSX.Element;
        buttons: ConfirmationModalButton[];
    };

class ConfirmationModal extends React.Component<ConfirmationModalProps> {
    private getPreset(preset: ConfirmationModalButtonPreset): ConfirmationModalButton {
        const {theme} = this.props;

        switch (preset) {
            case "cancel": {
                return {
                    text: i18n.t("cancel"),
                    backgroundColor: theme.background,
                    color: theme.text,
                    onPress: (hide) => hide(),
                };
            }
            case "confirm": {
                return {
                    text: i18n.t("ok"),
                    backgroundColor: theme.okay,
                    color: theme.textWhite,
                    onPress: (hide) => hide(),
                };
            }
            case "delete": {
                return {
                    text: i18n.t("delete"),
                    backgroundColor: theme.error,
                    color: theme.textWhite,
                    onPress: (hide) => hide(),
                };
            }
        }
    }

    render() {
        const {theme, title, text, justifyText, icon, buttons, additionalContent, ...otherProps} = this.props;
        const styles = themedStyles(theme);

        const buttonDefaults = {backgroundColor: theme.okay, color: theme.textWhite};

        return (
            <CustomModal
                {...otherProps}
                modalViewStyle={[styles.modalStyle, otherProps.modalViewStyle]}
                renderContent={(hide: () => void) => (
                    <>
                        {icon && icon({style: styles.icon})}
                        <View style={styles.contentContainer}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={[styles.text, justifyText ? {textAlign: "justify"} : {}]}>{text}</Text>
                            {additionalContent && additionalContent(hide, {style: styles.contentText})}
                        </View>
                        <View style={styles.actionsWrapper}>
                            {buttons.map((buttonParams, i) => {
                                const b = {
                                    ...buttonDefaults,
                                    ...(buttonParams.preset ? this.getPreset(buttonParams.preset) : {}),
                                    ...buttonParams,
                                };
                                return (
                                    <TouchableOpacity
                                        key={`modal-button-${i}-${b.text}`}
                                        style={[styles.action, {backgroundColor: b.backgroundColor}]}
                                        onPress={() => b.onPress && b.onPress(hide)}
                                    >
                                        {b.text && <Text style={[styles.actionText, {color: b.color}]}>{b.text}</Text>}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </>
                )}
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        modalStyle: {
            paddingHorizontal: 0,
            paddingVertical: 0,
            paddingTop: 20,
            borderRadius: 20,
            overflow: "hidden",
        },
        actionsWrapper: {
            width: "100%",
            flexDirection: "row",
            marginTop: 20,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: theme.componentBorder,
        },
        action: {
            flex: 1,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
        },
        actionText: {
            fontSize: 16,
        },
        contentContainer: {
            paddingHorizontal: 25,
            width: "100%",
        },
        icon: {
            fontSize: 36,
            marginBottom: 5,
        },
        title: {
            fontSize: 24,
            width: "100%",
            textAlign: "center",
            color: theme.text,
            ...styleTextLight,
        },
        text: {
            fontSize: 16,
            color: theme.textLight,
            marginVertical: 10,
            textAlign: "center",
        },
        contentText: {
            fontSize: 16,
            color: theme.textLight,
            textAlign: "justify",
        },
    });
});

export default withTheme(ConfirmationModal);
