import * as React from "react";
import {Modal, Text, TouchableOpacity, TouchableOpacityProps, View, StyleSheet, Platform} from "react-native";
import {formStyles} from "../../styles/forms";
import i18n from "i18n-js";
import {MaterialIcons} from "@expo/vector-icons";
import {ArraySchema, Schema, ValidationError} from "yup";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {ThemeConsumer} from "react-native-elements";
import CustomModal from "../modals/CustomModal";

// Component props
type ValueCardProps<T> = {
    label: string;
    display?: JSX.Element;
    noModal?: boolean;
    overrideModal?: (hide: () => void) => JSX.Element;
    renderInput?: (value: T, error: string | null, onChange: (value: T) => void) => JSX.Element;
    validator?: Schema<unknown> | ArraySchema<unknown>;
    initialValue: T;
    apply?: (value: T) => void;
    locked?: boolean;
} & TouchableOpacityProps;

// Component state
type ValueCardState<T> = {
    modalOpen: boolean;
    error: string | null;
    value: T;
};

class ValueCard<T> extends React.Component<ValueCardProps<T>, ValueCardState<T>> {
    constructor(props: ValueCardProps<T>) {
        super(props);
        this.state = {
            modalOpen: false,
            error: null,
            value: props.initialValue,
        };
    }

    setModal(modalOpen: boolean): void {
        // Reset to initial value when opening the modal
        this.setState({...this.state, modalOpen, value: this.props.initialValue, error: null});
    }

    setError(error: string | null): void {
        this.setState({...this.state, error});
    }

    onChange(value: T): void {
        this.setState({...this.state, value}, () => {
            this.validate();
        });
    }

    validate(): boolean {
        const {validator} = this.props;
        if (!validator) return true;
        try {
            validator.validateSync(this.state.value);
            this.setError(null);
            return true;
        } catch (err) {
            this.setError((err as ValidationError).errors[0]);
            return false;
        }
    }

    apply(): void {
        if (this.validate()) {
            this.setModal(false);
            if (this.props.apply) this.props.apply(this.state.value);
        }
    }

    renderModalContent = (): JSX.Element => {
        const {label, renderInput} = this.props;
        const {value, error} = this.state;

        return (
            // We have to use a ThemeConsumer here instead of the standard withTheme(...) pattern so our generic typing doesn't break.
            <ThemeConsumer>
                {({theme}: ThemeProps) => {
                    const styles = themedStyles(theme);
                    const fstyles = formStyles(theme);
                    return (
                        <TouchableOpacity
                            style={styles.modalTouchable}
                            onPress={() => this.setModal(false)}
                            activeOpacity={1}
                        >
                            <TouchableOpacity activeOpacity={1} style={styles.modalWrapper}>
                                <Text style={styles.modalLabel}>{label}</Text>
                                {renderInput ? renderInput(value, error, (value: T) => this.onChange(value)) : <></>}
                                <Text style={styles.modalErrorText}>{/*touched && */ error ? i18n.t(error) : ""}</Text>
                                <View style={[fstyles.actionRow, styles.modalActions]}>
                                    <TouchableOpacity
                                        accessibilityRole="button"
                                        accessibilityLabel={i18n.t("cancel")}
                                        onPress={() => this.setModal(false)}
                                        style={[fstyles.buttonMajor, styles.modalCancel]}
                                    >
                                        <Text style={[fstyles.buttonMajorText, styles.modalActionText]}>
                                            {i18n.t("cancel")}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        accessibilityRole="button"
                                        accessibilityLabel={i18n.t("apply")}
                                        onPress={() => this.apply()}
                                        style={[fstyles.buttonMajor, styles.modalOk]}
                                    >
                                        <Text style={[fstyles.buttonMajorText, styles.modalActionText]}>
                                            {i18n.t("apply")}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    );
                }}
            </ThemeConsumer>
        );
    };

    render(): JSX.Element {
        const {label, display, overrideModal, noModal, style, locked, ...otherProps} = this.props;
        const {modalOpen} = this.state;

        return (
            // We have to use a ThemeConsumer here instead of the standard withTheme(...) pattern so our generic typing doesn't break.
            <ThemeConsumer>
                {({theme}: ThemeProps) => {
                    const styles = themedStyles(theme);
                    return (
                        <>
                            <TouchableOpacity
                                style={[styles.cardWrapper, style]}
                                activeOpacity={0.9}
                                disabled={noModal}
                                onPress={() => {
                                    if (!locked) this.setModal(true);
                                }}
                                {...otherProps}
                            >
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardLabel}>{label}</Text>
                                    <View>
                                        {display !== undefined && display}
                                        {display === undefined && this.props.children}
                                    </View>
                                </View>
                                {!noModal && (
                                    <View style={styles.rightIconContainer}>
                                        <MaterialIcons
                                            name={locked ? "lock" : "keyboard-arrow-right"}
                                            size={locked ? 30 : 40}
                                            style={styles.rightIcon}
                                        ></MaterialIcons>
                                    </View>
                                )}
                            </TouchableOpacity>
                            {!noModal && (
                                <>
                                    {overrideModal !== undefined &&
                                        modalOpen &&
                                        overrideModal(() => this.setModal(false))}
                                    {overrideModal === undefined &&
                                        modalOpen &&
                                        (Platform.OS === "web" ? (
                                            <CustomModal
                                                visible={modalOpen}
                                                renderContent={() => this.renderModalContent()}
                                            />
                                        ) : (
                                            <Modal transparent={true} visible={modalOpen} animationType="slide">
                                                {this.renderModalContent()}
                                            </Modal>
                                        ))}
                                </>
                            )}
                        </>
                    );
                }}
            </ThemeConsumer>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        modalTouchable: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
        },
        modalWrapper: {
            width: "80%",
            maxWidth: 500,
            backgroundColor: theme.cardBackground,
            paddingHorizontal: 10,
            paddingVertical: 20,
            borderRadius: 4,
            borderColor: "#ccc",
            borderWidth: 0.5,
            borderStyle: "solid",
        },
        modalErrorText: {
            fontSize: 12,
            color: theme.error,
        },
        modalLabel: {
            color: theme.textLight,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            fontSize: 13,
            marginBottom: 12,
        },
        modalActions: {
            height: 50,
            marginTop: 20,
        },
        modalCancel: {
            flex: 1,
            backgroundColor: theme.actionNeutral,
            marginRight: 6,
            height: 50,
        },
        modalOk: {
            flex: 1,
            backgroundColor: theme.accent,
            marginLeft: 6,
            height: 50,
        },
        modalActionText: {
            lineHeight: 50,
        },
        cardWrapper: {
            width: "100%",
            flexDirection: "row",
            backgroundColor: theme.cardBackground,
            paddingHorizontal: 10,
            elevation: 1,
            justifyContent: "space-evenly",
            paddingVertical: 15,
            minHeight: 80,
        },
        cardContent: {
            flex: 1,
            flexDirection: "column",
            //justifyContent: "space-evenly",
            justifyContent: "space-between",
        },
        cardLabel: {
            color: theme.textLight,
            textTransform: "uppercase",
            letterSpacing: 1,
            fontSize: 11,
            marginBottom: 10,
        },
        rightIconContainer: {justifyContent: "center"},
        rightIcon: {color: theme.textLight},
    });
});

export default ValueCard;