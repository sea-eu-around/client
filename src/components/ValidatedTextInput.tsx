import React from "react";
import {TextStyle, StyleProp, View, TextInputProps} from "react-native";
import {TextInput} from "react-native-gesture-handler";
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
export class ValidatedTextInput extends React.Component<ValidatedTextInputProps, ValidatedTextInputState> {
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

        return (
            <View style={[wrapperStyle, {width: "100%", flexDirection: "column", position: "relative"}]}>
                {label && <InputLabel style={labelStyle}>{label}</InputLabel>}
                <TextInput
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
                {showErrorText && !untouched && error && <InputErrorText style={errorTextStyle} error={error} />}
            </View>
        );
    }
}