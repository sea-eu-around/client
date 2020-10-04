import React from "react";
import i18n from "i18n-js";
import {TextStyle, StyleProp, Text, View, TextInputProps} from "react-native";
import {TextInput} from "react-native-gesture-handler";

export type ValidatedTextInputProps = {
    value: string;
    showErrorText?: boolean;
    error?: string | null;
    untouched?: boolean;
    style?: StyleProp<TextStyle>;
    wrapperStyle?: StyleProp<TextStyle>;
    errorStyle?: StyleProp<TextStyle>;
    validStyle?: StyleProp<TextStyle>;
    focusedStyle?: StyleProp<TextStyle>;
    errorTextStyle?: StyleProp<TextStyle>;
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
            untouched,
            errorStyle,
            validStyle,
            focusedStyle,
            errorTextStyle,
            onBlur,
            onFocus,
            ...otherProps
        } = this.props;

        return (
            <View style={[wrapperStyle, {width: "100%", flexDirection: "column", position: "relative"}]}>
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
                {showErrorText && !untouched && <Text style={[errorTextStyle, {}]}>{error ? i18n.t(error) : ""}</Text>}
            </View>
        );
    }
}
