import React from "react";
import {TextStyle, StyleProp, View, TextInputProps, TextInput} from "react-native";
import InputLabel from "./InputLabel";
import InputErrorText from "./InputErrorText";

export type ValidatedTextInputProps = {
    value: string;
    showErrorText?: boolean;
    error?: string;
    untouched?: boolean;
    label?: string;
    style?: StyleProp<TextStyle>;
    wrapperStyle?: StyleProp<TextStyle>;
    errorStyle?: StyleProp<TextStyle>;
    validStyle?: StyleProp<TextStyle>;
    focusedStyle?: StyleProp<TextStyle>;
    errorTextStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
} & Partial<TextInputProps>;

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
            style,
            wrapperStyle,
            error,
            value,
            label,
            untouched,
            errorStyle,
            validStyle,
            focusedStyle,
            errorTextStyle,
            labelStyle,
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
                <TextInput
                    ref={this.inputRef}
                    style={[
                        style,
                        this.state.focused ? focusedStyle : {},
                        untouched ? {} : error ? errorStyle : value.length > 0 ? validStyle : {},
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
                    {...otherProps}
                />
                {showError && <InputErrorText style={errorTextStyle} error={error} />}
            </View>
        );
    }
}

export default ValidatedTextInput;
