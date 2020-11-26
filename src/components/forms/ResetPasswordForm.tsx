import * as React from "react";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../FormTextInput";
import {VALIDATOR_PASSWORD_SIGNUP, VALIDATOR_PASSWORD_REPEAT} from "../../validators";
import {formStyles, getLoginTextInputsStyleProps} from "../../styles/forms";
import {FailableActionReturn, FormProps, Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import store from "../../state/store";
import {MyThunkDispatch} from "../../state/types";
import {resetPassword} from "../../state/auth/actions";

export type ResetPasswordFormState = {
    password: string;
    passwordRepeat: string;
};

const initialState = (): ResetPasswordFormState => ({
    password: "",
    passwordRepeat: "",
});

// Use Yup to create the validation schema
const ResetPasswordFormSchema = Yup.object().shape({
    password: VALIDATOR_PASSWORD_SIGNUP,
    passwordRepeat: VALIDATOR_PASSWORD_REPEAT,
});

// Component props
type ResetPasswordFormProps = {token?: string} & FormProps<ResetPasswordFormState> & ThemeProps;

// Component state
type ResetPasswordFormComponentState = {failure: boolean; errors?: string[]};

class ResetPasswordForm extends React.Component<ResetPasswordFormProps, ResetPasswordFormComponentState> {
    constructor(props: ResetPasswordFormProps) {
        super(props);
        this.state = {failure: false};
    }

    submit(values: ResetPasswordFormState) {
        const {token, onSuccessfulSubmit} = this.props;

        if (token) {
            (store.dispatch as MyThunkDispatch)(resetPassword(token, values.password)).then(
                ({success, errors}: FailableActionReturn) => {
                    if (success && onSuccessfulSubmit) onSuccessfulSubmit(values);
                    this.setState({...this.state, failure: !success, errors});

                    if (!success) {
                        Alert.alert("Unable to change password", errors && errors.length > 0 ? errors[0] : "", [
                            {text: "OK", onPress: () => console.log("OK Pressed")},
                        ]);
                    }
                },
            );
        }
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);
        const fstyles = formStyles(theme);

        return (
            <React.Fragment>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{i18n.t("resetPassword.title")}</Text>
                </View>
                <Formik
                    initialValues={initialState()}
                    validationSchema={ResetPasswordFormSchema}
                    validateOnChange={true}
                    validateOnBlur={false}
                    onSubmit={(values: ResetPasswordFormState) => this.submit(values)}
                >
                    {(formikProps: FormikProps<ResetPasswordFormState>) => {
                        const {handleSubmit, values, errors, touched, handleChange, handleBlur} = formikProps;
                        const textInputProps = {handleChange, handleBlur, ...getLoginTextInputsStyleProps(theme, 15)};

                        return (
                            <React.Fragment>
                                <FormTextInput
                                    field="password"
                                    placeholder={i18n.t("password")}
                                    error={errors.password}
                                    value={values.password}
                                    touched={touched.password}
                                    secureTextEntry={true}
                                    autoCompleteType="password"
                                    {...textInputProps}
                                />

                                <FormTextInput
                                    field="passwordRepeat"
                                    placeholder={i18n.t("passwordRepeat")}
                                    error={errors.passwordRepeat}
                                    value={values.passwordRepeat}
                                    touched={touched.passwordRepeat}
                                    secureTextEntry={true}
                                    autoCompleteType="password"
                                    {...textInputProps}
                                />

                                <View style={fstyles.actionRow}>
                                    <TouchableOpacity
                                        accessibilityRole="button"
                                        accessibilityLabel={i18n.t("createAccount")}
                                        onPress={() => handleSubmit()}
                                        style={[fstyles.buttonMajor, styles.button]}
                                    >
                                        <Text style={fstyles.buttonMajorText}>{i18n.t("resetPassword.button")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </React.Fragment>
                        );
                    }}
                </Formik>
            </React.Fragment>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        titleWrapper: {
            width: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            marginBottom: 20,
        },
        title: {
            fontSize: 22,
            color: theme.text,
        },
        button: {
            width: "60%",
            backgroundColor: theme.accent,
        },
    });
});

export default withTheme(ResetPasswordForm);
