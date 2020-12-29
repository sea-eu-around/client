import * as React from "react";
import {Text, TouchableOpacity, TouchableOpacityProps, View, StyleSheet} from "react-native";
import i18n from "i18n-js";
import {MaterialIcons} from "@expo/vector-icons";
import {ArraySchema, Schema, ValidationError} from "yup";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {ThemeConsumer} from "react-native-elements";
import CustomModal from "../modals/CustomModal";
import Button from "../Button";

// Component props
type ValueCardProps<T> = {
    label: string;
    icon?: JSX.Element;
    display?: JSX.Element;
    noModal?: boolean;
    overrideModal?: (hide: () => void) => JSX.Element;
    renderInput?: (value: T, error: string | null, onChange: (value: T, error?: string | null) => void) => JSX.Element;
    validator?: Schema<unknown> | ArraySchema<unknown>;
    initialValue?: T;
    apply?: (value: T) => void;
    locked?: boolean;
    oneLine?: boolean;
    onPress?: () => void;
    onModalShown?: () => void;
    blank?: boolean;
} & TouchableOpacityProps;

// Component state
type ValueCardState<T> = {
    modalOpen: boolean;
    error: string | null;
    value: T | undefined;
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
        const {initialValue} = this.props;
        // Reset to initial value when opening the modal
        this.setState({...this.state, modalOpen, value: initialValue, error: null});
    }

    setError(error: string | null): void {
        this.setState({...this.state, error});
    }

    onChange(value: T, error?: string | null): void {
        if (error === undefined) error = this.state.error;
        this.setState({...this.state, value, error}, () => this.validate());
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
            if (this.props.apply && this.state.value) this.props.apply(this.state.value);
            this.setModal(false);
        }
    }

    renderModalContent = (theme: Theme): JSX.Element => {
        const {label, renderInput, oneLine} = this.props;
        const {value, error} = this.state;

        const styles = themedStyles(oneLine)(theme);

        return (
            <>
                <Text style={styles.modalLabel}>{label}</Text>
                {renderInput && value ? (
                    renderInput(value, error, (value: T, error?: string | null) => this.onChange(value, error))
                ) : (
                    <></>
                )}
                <Text style={styles.modalErrorText}>{/*touched && */ error ? i18n.t(error) : ""}</Text>
                <View style={styles.modalButtonsContainer}>
                    <Button
                        onPress={() => this.apply()}
                        style={styles.modalButton}
                        text={i18n.t("apply")}
                        skin="rounded-filled"
                    />
                    <Button
                        onPress={() => this.setModal(false)}
                        style={styles.modalButton}
                        text={i18n.t("cancel")}
                        skin="rounded-hollow"
                    />
                </View>
            </>
        );
    };

    render(): JSX.Element {
        const {
            label,
            icon,
            display,
            overrideModal,
            noModal,
            style,
            locked,
            oneLine,
            blank,
            onPress,
            onModalShown,
            ...otherProps
        } = this.props;
        const {modalOpen} = this.state;

        const onShow = () => {
            if (onModalShown) onModalShown();
        };

        return (
            // We have to use a ThemeConsumer here instead of the standard withTheme(...) pattern so our generic typing doesn't break.
            <ThemeConsumer>
                {({theme}: ThemeProps) => {
                    const styles = themedStyles(oneLine)(theme);
                    return (
                        <>
                            <TouchableOpacity
                                style={[styles.cardWrapper, style]}
                                activeOpacity={0.9}
                                disabled={noModal && !onPress}
                                onPress={() => {
                                    if (!noModal) {
                                        if (!locked) this.setModal(true);
                                    } else if (onPress) onPress();
                                }}
                                {...otherProps}
                            >
                                <View style={styles.cardContent}>
                                    <View style={styles.cardLabelContainer}>
                                        {!blank && icon}
                                        <Text style={styles.cardLabel}>{!blank && label}</Text>
                                    </View>
                                    <View>
                                        {!blank && display !== undefined && display}
                                        {!blank && display === undefined && this.props.children}
                                    </View>
                                </View>
                                {!noModal && (
                                    <View style={styles.rightIconContainer}>
                                        <MaterialIcons
                                            name={locked ? "lock" : "keyboard-arrow-right"}
                                            size={locked ? 30 : 40}
                                            style={styles.rightIcon}
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                            {!noModal && (
                                <>
                                    {overrideModal !== undefined &&
                                        modalOpen &&
                                        overrideModal(() => this.setModal(false))}
                                    {overrideModal === undefined && modalOpen && (
                                        <CustomModal
                                            visible={modalOpen}
                                            modalViewStyle={styles.modalContent}
                                            animationType="slide"
                                            renderContent={() => this.renderModalContent(theme)}
                                            onShow={onShow}
                                            onHide={() => this.setModal(false)}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    );
                }}
            </ThemeConsumer>
        );
    }
}

const themedStyles = (oneLine?: boolean) =>
    preTheme((theme: Theme) => {
        return StyleSheet.create({
            modalContent: {
                alignItems: "flex-start",
                paddingHorizontal: 20,
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
            modalButtonsContainer: {
                flexDirection: "column",
                width: "100%",
            },
            modalButton: {
                marginVertical: 0,
                marginTop: 15,
            },
            cardWrapper: {
                width: "100%",
                flexDirection: "row",
                backgroundColor: theme.cardBackground,
                paddingHorizontal: 10,
                justifyContent: "space-evenly",
                paddingVertical: 15,
                minHeight: oneLine ? 0 : 80,
                borderRadius: 10,
            },
            cardContent: {
                flex: 1,
                flexDirection: oneLine ? "row" : "column",
                ...(oneLine ? {alignItems: "center"} : {}),
                justifyContent: "space-between",
            },
            cardLabelContainer: {
                flexDirection: "row",
                alignItems: "center",
                marginBottom: oneLine ? 0 : 10,
            },
            cardLabel: {
                color: theme.textLight,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontSize: 11,
            },
            rightIconContainer: {justifyContent: "center"},
            rightIcon: {color: theme.textLight},
        });
    });

export default ValueCard;
