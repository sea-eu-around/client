import React from "react";
import {ValidatedTextInput, ValidatedTextInputProps} from "./ValidatedTextInput";

export type FormTextInputProps = {
    field: string;
    touched: boolean | undefined;
    showErrorText?: boolean;
    handleChange<T = string | React.ChangeEvent<unknown>>(
        field: T,
    ): T extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    handleBlur<T = string | unknown>(fieldOrEvent: T): T extends string ? (e: unknown) => void : void;
} & ValidatedTextInputProps;

/**
 * An improved TextInput for less verbose Formik usage.
 */
export class FormTextInput extends React.Component<FormTextInputProps> {
    static defaultProps = {
        showErrorText: true,
        /* eslint-disable @typescript-eslint/no-empty-function */
        handleChange: (): void => {},
        handleBlur: (): void => {},
        /* eslint-ensable @typescript-eslint/no-empty-function */
    };

    render(): JSX.Element {
        const {field, touched, handleChange, handleBlur, error, onBlur, onChangeText, ...otherProps} = this.props;
        return (
            <ValidatedTextInput
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
                {...otherProps}
            />
        );
    }
}
