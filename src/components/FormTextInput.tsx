import React from "react";
import {TextInputProps} from "react-native";
import ValidatedTextInput, {ValidatedTextInputProps} from "./ValidatedTextInput";

// Component props
export type FormTextInputProps = {
    field: string;
    touched: boolean | undefined;
    showErrorText?: boolean;
    handleChange<T = string | React.ChangeEvent<unknown>>(
        field: T,
    ): T extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    handleBlur<T = string | unknown>(fieldOrEvent: T): T extends string ? (e: unknown) => void : void;
    isEmail?: boolean;
    isPassword?: boolean;
} & ValidatedTextInputProps;

const emailProps: Partial<TextInputProps> = {
    keyboardType: "email-address",
    autoCompleteType: "email",
    textContentType: "emailAddress",
    autoCapitalize: "none",
    autoCorrect: false,
};
const passwordProps: Partial<TextInputProps> = {
    secureTextEntry: true,
    autoCompleteType: "password",
    textContentType: "password",
    autoCapitalize: "none",
    autoCorrect: false,
};

/**
 * An improved TextInput for less verbose Formik usage.
 */
export class FormTextInput extends React.Component<FormTextInputProps> {
    inputRef = React.createRef<ValidatedTextInput>();

    static defaultProps = {
        showErrorText: true,
        /* eslint-disable @typescript-eslint/no-empty-function */
        handleChange: (): void => {},
        handleBlur: (): void => {},
        /* eslint-ensable @typescript-eslint/no-empty-function */
    };

    focus(): void {
        this.inputRef.current?.focus();
    }

    render(): JSX.Element {
        const {
            field,
            touched,
            handleChange,
            handleBlur,
            error,
            onBlur,
            onChangeText,
            isEmail,
            isPassword,
            ...otherProps
        } = this.props;

        return (
            <ValidatedTextInput
                ref={this.inputRef}
                error={touched ? error : undefined}
                untouched={!touched}
                onChangeText={(value: string) => {
                    if (onChangeText) onChangeText(value);
                    handleChange(field)(value);
                }}
                onBlur={(e) => {
                    if (onBlur) onBlur(e);
                    handleBlur(this.props.field)(e);
                }}
                {...(isEmail ? emailProps : {})}
                {...(isPassword ? passwordProps : {})}
                {...otherProps}
            />
        );
    }
}
