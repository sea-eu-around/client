import * as React from "react";
import {Modal, Text, TouchableOpacity, TouchableOpacityProps, View, StyleSheet} from "react-native";
import {formStyle} from "../../styles/forms";
import i18n from "i18n-js";
import {MaterialIcons} from "@expo/vector-icons";
import {Schema, ValidationError} from "yup";
import {Theme} from "../../types";
import {preTheme} from "../../styles/utils";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import themes from "../../constants/themes";

// Map props from the store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
type FormRowProps<T> = ConnectedProps<typeof reduxConnector> & {
    label: string;
    display?: JSX.Element;
    noModal?: boolean;
    overrideModal?: (hide: () => void) => JSX.Element;
    renderInput?: (value: T, error: string | null, onChange: (value: T) => void) => JSX.Element;
    validator?: Schema<T>;
    initialValue: T;
    apply?: (value: T) => void;
    locked?: boolean;
} & TouchableOpacityProps;

// Component state
type FormRowState<T> = {
    modalOpen: boolean;
    error: string | null;
    value: T;
};

class FormRowComponent<T> extends React.Component<FormRowProps<T>, FormRowState<T>> {
    constructor(props: FormRowProps<T>) {
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
        const {label, theme, renderInput} = this.props;
        const {value, error} = this.state;

        const styles = themedStyles(theme);

        return (
            <TouchableOpacity style={styles.modalTouchable} onPress={() => this.setModal(false)} activeOpacity={1}>
                <TouchableOpacity activeOpacity={1} style={styles.modalWrapper}>
                    <Text style={styles.modalLabel}>{label}</Text>
                    {renderInput ? renderInput(value, error, (value: T) => this.onChange(value)) : <></>}
                    <Text style={styles.modalErrorText}>{/*touched && */ error ? i18n.t(error) : ""}</Text>
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel="CANCEL"
                            onPress={() => this.setModal(false)}
                            style={styles.modalCancel}
                        >
                            <Text style={styles.modalActionText}>{i18n.t("cancel")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel="OK"
                            onPress={() => this.apply()}
                            style={styles.modalOk}
                        >
                            <Text style={styles.modalActionText}>{i18n.t("apply")}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    render(): JSX.Element {
        const {theme, label, display, overrideModal, noModal, style, locked, ...otherProps} = this.props;
        const {modalOpen} = this.state;

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
                    <React.Fragment>
                        {overrideModal !== undefined && modalOpen && overrideModal(() => this.setModal(false))}
                        {overrideModal === undefined && modalOpen && (
                            <Modal transparent={true} visible={modalOpen} animationType="slide">
                                {this.renderModalContent()}
                            </Modal>
                        )}
                    </React.Fragment>
                )}
            </>
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
            ...formStyle.actionRow,
            height: 50,
            marginTop: 20,
        },
        modalCancel: {
            ...formStyle.buttonMajor,
            flex: 1,
            backgroundColor: theme.actionNeutral,
            marginRight: 6,
            height: 50,
        },
        modalOk: {
            ...formStyle.buttonMajor,
            flex: 1,
            backgroundColor: theme.accent,
            marginLeft: 6,
            height: 50,
        },
        modalActionText: {
            ...formStyle.buttonMajorText,
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

export default reduxConnector(FormRowComponent);
