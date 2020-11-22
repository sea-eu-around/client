import React from "react";
import {ValidatedCheckBox, ValidatedCheckBoxProps} from "./ValidatedCheckBox";

// Component props
export type FormCheckBoxProps = {
    field: string;
    touched: boolean | undefined;
    setFieldValue: (field: string, value: boolean, shouldValidate?: boolean) => void;
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
} & ValidatedCheckBoxProps;

/**
 * An improved CheckBox for less verbose Formik usage.
 */
export class FormCheckBox extends React.Component<FormCheckBoxProps> {
    static defaultProps = {
        wrapperStyle: [],
        errorStyle: [],
        labelStyle: [],
        errorTextStyle: [],
    };

    render(): JSX.Element {
        const {field, touched, setFieldValue, setFieldTouched, error, value, ...otherProps} = this.props;
        return (
            <ValidatedCheckBox
                error={touched ? error : undefined}
                value={value}
                untouched={!touched}
                {...otherProps}
                onPress={() => {
                    setFieldValue(field, !value);
                    setFieldTouched(field, true);
                }}
            />
        );
    }
}
