import {connect, ConnectedProps} from "react-redux";
import themes from "../../constants/themes";
import {AppState} from "../../state/types";
import * as React from "react";
import {Modal, Text, TouchableOpacity, TouchableOpacityProps, View} from "react-native";
import {formStyle} from "../../styles/forms";
import i18n from "i18n-js";
import {MaterialIcons} from "@expo/vector-icons";
import {Schema, ValidationError} from "yup";

// Map props from the store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
type FormRowProps<T> = ConnectedProps<typeof reduxConnector> & {
    label: string;
    children: React.ReactNode;
    display?: JSX.Element;
    noModal: boolean;
    overrideModal?: (hide: () => void) => JSX.Element;
    renderInput: (value: T, error: string | null, onChange: (value: T) => void) => JSX.Element;
    validator?: Schema<T>;
    initialValue: T;
    apply?: (value: T) => void;
    locked: boolean;
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

    onChange(value: T) {
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

    apply() {
        if (this.validate()) {
            this.setModal(false);
            if (this.props.apply) this.props.apply(this.state.value);
        }
    }

    renderModalContent = (): JSX.Element => {
        const {label, theme} = this.props;
        const {value, error} = this.state;

        const errorStyle = {
            fontSize: 12,
            color: theme.error,
        };

        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                }}
                onPress={() => this.setModal(false)}
                activeOpacity={1}
            >
                <View
                    style={{
                        width: "80%",
                        maxWidth: 500,
                        backgroundColor: "#fff",
                        paddingHorizontal: 10,
                        paddingVertical: 20,
                        borderRadius: 4,
                        borderColor: "#ccc",
                        borderWidth: 0.5,
                        borderStyle: "solid",
                    }}
                >
                    <Text
                        style={{
                            color: theme.textLight,
                            textTransform: "uppercase",
                            letterSpacing: 1.5,
                            fontSize: 13,
                            marginBottom: 12,
                        }}
                    >
                        {label}
                    </Text>
                    {this.props.renderInput(value, error, (value: T) => this.onChange(value))}
                    <Text style={errorStyle}>{/*touched && */ error ? i18n.t(error) : ""}</Text>
                    <View style={[formStyle.actionRow, {height: 50, marginTop: 20}]}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel="CANCEL"
                            onPress={() => this.setModal(false)}
                            style={[
                                formStyle.buttonMajor,
                                {
                                    flex: 1,
                                    backgroundColor: theme.actionNeutral,
                                    marginRight: 6,
                                    height: 50,
                                },
                            ]}
                        >
                            <Text style={[formStyle.buttonMajorText, {lineHeight: 50}]}>{i18n.t("cancel")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel="OK"
                            onPress={() => this.apply()}
                            style={[
                                formStyle.buttonMajor,
                                {
                                    flex: 1,
                                    backgroundColor: theme.accent,
                                    marginLeft: 6,
                                    height: 50,
                                },
                            ]}
                        >
                            <Text style={[formStyle.buttonMajorText, {lineHeight: 50}]}>{i18n.t("apply")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    render(): JSX.Element {
        const {theme, label, children, display, overrideModal, noModal, style, locked, ...otherProps} = this.props;
        const {modalOpen} = this.state;

        return (
            <React.Fragment>
                <TouchableOpacity
                    style={[
                        {
                            width: "100%",
                            flexDirection: "row",
                            backgroundColor: "#fff",
                            paddingHorizontal: 10,
                            height: 80,
                            elevation: 1,
                            justifyContent: "space-evenly",
                        },
                        style,
                    ]}
                    activeOpacity={0.9}
                    disabled={noModal}
                    onPress={() => {
                        if (!locked) this.setModal(true);
                    }}
                    {...otherProps}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <Text
                            style={{
                                color: theme.textLight,
                                textTransform: "uppercase",
                                letterSpacing: 1,
                                fontSize: 11,
                            }}
                        >
                            {label}
                        </Text>
                        <View>
                            {display !== undefined && display}
                            {display === undefined && children}
                        </View>
                    </View>
                    {!noModal && (
                        <View style={{justifyContent: "center"}}>
                            <MaterialIcons
                                name={locked ? "lock" : "keyboard-arrow-right"}
                                size={locked ? 30 : 40}
                                style={{color: theme.textLight}}
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
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(FormRowComponent);
