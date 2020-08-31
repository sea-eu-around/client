import React from "react";
import i18n from "i18n-js";
import {
    TextStyle,
    StyleProp,
    NativeSyntheticEvent,
    TextInputFocusEventData,
    Text,
    View,
    TextInputProperties,
} from "react-native";
import {TextInput} from "react-native-gesture-handler";

export type FormTextInputProps = {
    field: string;
    value: string;
    error: string | undefined;
    touched: boolean | undefined;
    handleChange<T = string | React.ChangeEvent<unknown>>(
        field: T,
    ): T extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    handleBlur<T = string | unknown>(fieldOrEvent: T): T extends string ? (e: unknown) => void : void;
    style: StyleProp<TextStyle>;
    wrapperStyle: StyleProp<TextStyle>;
    errorStyle: StyleProp<TextStyle>;
    validStyle: StyleProp<TextStyle>;
    focusedStyle: StyleProp<TextStyle>;
    errorTextStyle: StyleProp<TextStyle>;
    onBlur: () => void;
    onChange: () => void;
} & TextInputProperties;

type FormTextInputState = {
    focused: boolean;
};

/**
 * An improved TextInput for less verbose Formik usage.
 * Supports styling of the different parts, focused styling and displays validation errors.
 */
export class FormTextInput extends React.Component<FormTextInputProps, FormTextInputState> {
    static defaultProps = {
        style: [],
        wrapperStyle: [],
        errorStyle: [],
        validStyle: [],
        focusedStyle: [],
        errorTextStyle: [],
        /* eslint-disable @typescript-eslint/no-empty-function */
        onBlur: (): void => {},
        onChange: (): void => {},
        handleChange: (): void => {},
        handleBlur: (): void => {},
        /* eslint-ensable @typescript-eslint/no-empty-function */
    };

    constructor(props: FormTextInputProps) {
        super(props);
        this.state = {focused: false} as FormTextInputState;
    }

    onFocus(): void {
        this.setState({focused: true});
    }

    onBlur(e: NativeSyntheticEvent<TextInputFocusEventData>): void {
        this.props.handleBlur(this.props.field)(e);
        this.setState({focused: false});
    }

    render(): JSX.Element {
        const {
            wrapperStyle,
            style,
            error,
            value,
            field,
            touched,
            errorStyle,
            validStyle,
            focusedStyle,
            errorTextStyle,
            handleChange,
            handleBlur, // eslint-disable-line @typescript-eslint/no-unused-vars
            onChange,
            onBlur,
            ...otherProps
        } = this.props;
        return (
            <View style={[wrapperStyle, {flexDirection: "column"}]}>
                <TextInput
                    style={[
                        style,
                        this.state.focused ? focusedStyle : {},
                        touched ? (error ? errorStyle : value.length > 0 ? validStyle : {}) : {},
                    ]}
                    onChangeText={(e) => {
                        onChange();
                        handleChange(field)(e);
                    }}
                    onBlur={(e) => {
                        onBlur();
                        this.onBlur(e);
                    }}
                    onFocus={() => this.onFocus()}
                    value={value}
                    {...otherProps}
                />
                <Text style={errorTextStyle}>{touched && error ? i18n.t(error) : ""}</Text>
            </View>
        );
    }
}
