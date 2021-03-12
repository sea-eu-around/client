import React from "react";
import {
    TextStyle,
    StyleProp,
    View,
    TextInputProps,
    TextInput,
    ViewStyle,
    TouchableOpacity,
    Platform,
} from "react-native";
import InputLabel from "./InputLabel";
import InputErrorText from "./InputErrorText";
import {FontAwesome} from "@expo/vector-icons";

export type TextInputStyleProps = {
    style?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    errorStyle?: StyleProp<TextStyle>;
    validStyle?: StyleProp<TextStyle>;
    focusedStyle?: StyleProp<TextStyle>;
    errorTextStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>;
    inputFocusedStyle?: StyleProp<TextStyle>;
    showPasswordButtonStyle?: StyleProp<TextStyle>;
    showPasswordIconStyle?: StyleProp<TextStyle>;
    placeholderTextColor?: string;
};

export type ValidatedTextInputProps = {
    value: string;
    showErrorText?: boolean;
    error?: string;
    untouched?: boolean;
    label?: string;
    icon?: (focused: boolean, error: boolean, valid: boolean) => JSX.Element;
} & TextInputStyleProps &
    Partial<TextInputProps>;

type ValidatedTextInputState = {
    focused: boolean;
    showSecureEntry: boolean;
};

/**
 * An improved TextInput that supports better styling (including specific focused style) and displays validation errors.
 */
class ValidatedTextInput extends React.Component<ValidatedTextInputProps, ValidatedTextInputState> {
    inputRef = React.createRef<TextInput>();

    static defaultProps = {
        untouched: false,
        style: [],
        wrapperStyle: [],
        errorStyle: [],
        validStyle: [],
        focusedStyle: [],
        errorTextStyle: [],
        labelStyle: [],
    };

    constructor(props: ValidatedTextInputProps) {
        super(props);
        this.state = {focused: false, showSecureEntry: false} as ValidatedTextInputState;
    }

    focus(): void {
        this.inputRef.current?.focus();
    }

    blur(): void {
        this.inputRef.current?.blur();
    }

    render(): JSX.Element {
        const {
            showErrorText,
            error,
            value,
            label,
            icon,
            untouched,
            secureTextEntry,
            style,
            wrapperStyle,
            inputStyle,
            inputFocusedStyle,
            errorStyle,
            validStyle,
            focusedStyle,
            errorTextStyle,
            labelStyle,
            showPasswordButtonStyle,
            showPasswordIconStyle,
            placeholderTextColor,
            onBlur,
            onFocus,
            ...otherProps
        } = this.props;

        const {showSecureEntry} = this.state;

        const showError = showErrorText && !untouched && error;
        const isSecureEntry = secureTextEntry === true;

        return (
            <View
                style={[
                    wrapperStyle,
                    {width: "100%", flexDirection: "column", position: "relative", paddingBottom: showError ? 0 : 6},
                ]}
            >
                {label && <InputLabel style={labelStyle}>{label}</InputLabel>}
                <View
                    style={[
                        {flexDirection: "row", alignItems: "center"},
                        style,
                        this.state.focused ? focusedStyle : {},
                        untouched ? {} : error ? errorStyle : value.length > 0 ? validStyle : {},
                    ]}
                >
                    {icon && icon(this.state.focused, error !== undefined, error !== undefined && value.length > 0)}
                    <TextInput
                        ref={this.inputRef}
                        style={[
                            {flex: 1, height: "100%", backgroundColor: "transparent"},
                            inputStyle,
                            this.state.focused && Platform.OS === "web" ? ({outline: "none"} as TextStyle) : {},
                            this.state.focused ? inputFocusedStyle : {},
                            // untouched ? {} : error ? errorStyle : value.length > 0 ? validStyle : {},
                        ]}
                        onBlur={(e) => {
                            if (onBlur) onBlur(e);
                            this.setState({focused: false});
                        }}
                        onFocus={(e) => {
                            if (onFocus) onFocus(e);
                            this.setState({focused: true});
                        }}
                        // Workaround to prevent the input from getting slow with large amounts of text (use defaultValue instead of value)
                        // TODO test that this doesn't break anything
                        defaultValue={value}
                        // value={value}
                        placeholderTextColor={placeholderTextColor}
                        {...(isSecureEntry ? {secureTextEntry: !showSecureEntry} : {})}
                        {...otherProps}
                    />
                    {isSecureEntry && (
                        <TouchableOpacity
                            style={showPasswordButtonStyle}
                            onPress={() => this.setState({...this.state, showSecureEntry: !showSecureEntry})}
                        >
                            <FontAwesome name={showSecureEntry ? "eye-slash" : "eye"} style={showPasswordIconStyle} />
                        </TouchableOpacity>
                    )}
                </View>
                {showError && <InputErrorText style={errorTextStyle} error={error} />}
            </View>
        );
    }
}

export default ValidatedTextInput;
