import React from "react";
import {TextStyle, StyleSheet, StyleProp, Text, View} from "react-native";
import {CheckBox, CheckBoxProps} from "react-native-elements";
import InputErrorText from "./InputErrorText";

export type ValidatedCheckBoxProps = {
    value: boolean;
    showErrorText?: boolean;
    error?: string;
    untouched?: boolean;
    label?: string;
    wrapperStyle?: StyleProp<TextStyle>;
    errorStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    errorTextStyle?: StyleProp<TextStyle>;
} & Partial<CheckBoxProps>;

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
 * An improved CheckBox that supports better styling and displays validation errors.
 */
export class ValidatedCheckBox extends React.Component<ValidatedCheckBoxProps> {
    static defaultProps = {
        untouched: false,
        wrapperStyle: [],
        errorStyle: [],
        labelStyle: [],
        errorTextStyle: [],
    };

    render(): JSX.Element {
        const {
            showErrorText,
            untouched,
            error,
            value,
            label,
            wrapperStyle,
            labelStyle,
            errorStyle,
            errorTextStyle,
            ...otherProps
        } = this.props;

        return (
            <React.Fragment>
                <View style={[staticStyle.wrapper, wrapperStyle, error ? errorStyle : {}]}>
                    <CheckBox checked={value} {...otherProps} />
                    {label && <Text style={[staticStyle.label, labelStyle]}>{label}</Text>}
                </View>
                {showErrorText && !untouched && error && <InputErrorText style={errorTextStyle} error={error} />}
            </React.Fragment>
        );
    }
}
