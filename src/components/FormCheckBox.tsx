import React from "react";
import i18n from "i18n-js";
import {TextStyle, StyleSheet, StyleProp, Text, CheckBoxProps, CheckBox, View} from "react-native";

export type FormCheckBoxProps = {
    field: string;
    value: boolean;
    label: string;
    error: string | undefined;
    touched: boolean | undefined;
    setFieldValue: (field: string, value: boolean, shouldValidate?: boolean) => void;
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
    wrapperStyle?: StyleProp<TextStyle>;
    errorStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    errorTextStyle?: StyleProp<TextStyle>;
} & CheckBoxProps;

const staticStyle = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        flex: 1,
        marginLeft: 20,
    },
});

/**
 * An improved CheckBox for less verbose Formik usage.
 * Displays a label and validation errors if needed.
 */
export class FormCheckBox extends React.Component<FormCheckBoxProps> {
    static defaultProps = {
        wrapperStyle: [],
        errorStyle: [],
        labelStyle: [],
        errorTextStyle: [],
    };

    render(): JSX.Element {
        const {
            wrapperStyle,
            error,
            value,
            field,
            touched,
            label,
            labelStyle,
            errorStyle,
            errorTextStyle,
            setFieldValue,
            setFieldTouched,
            ...otherProps
        } = this.props;

        return (
            <React.Fragment>
                <View style={[staticStyle.wrapper, wrapperStyle, error ? errorStyle : {}]}>
                    <CheckBox
                        onChange={() => {
                            setFieldValue(field, !value);
                            setFieldTouched(field, true);
                        }}
                        value={value}
                        {...otherProps}
                    />
                    <Text style={[staticStyle.label, labelStyle]}>{label}</Text>
                </View>
                <Text style={errorTextStyle}>{touched && error ? i18n.t(error) : ""}</Text>
            </React.Fragment>
        );
    }
}
