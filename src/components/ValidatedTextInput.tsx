import React from "react";
import {TextStyle, StyleProp, View, TextInputProps, TextInput, ViewStyle} from "react-native";
import InputLabel from "./InputLabel";
import InputErrorText from "./InputErrorText";

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
        this.state = {focused: false} as ValidatedTextInputState;
    }

    focus(): void {
        this.inputRef.current?.focus();
    }

    render(): JSX.Element {
        const {
            showErrorText,
            error,
            value,
            label,
            icon,
            untouched,
            style,
            wrapperStyle,
            inputStyle,
            inputFocusedStyle,
            errorStyle,
            validStyle,
            focusedStyle,
            errorTextStyle,
            labelStyle,
            placeholderTextColor,
            onBlur,
            onFocus,
            ...otherProps
        } = this.props;

        const showError = showErrorText && !untouched && error;

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
                        value={value}
                        placeholderTextColor={placeholderTextColor}
                        {...otherProps}
                    />
                </View>
                {showError && <InputErrorText style={errorTextStyle} error={error} />}
            </View>
        );
    }
}

export default ValidatedTextInput;
