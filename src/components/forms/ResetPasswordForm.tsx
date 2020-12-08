import * as React from "react";
import {StyleSheet, Text, TextInput, View} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../FormTextInput";
import {VALIDATOR_PASSWORD_SIGNUP, VALIDATOR_PASSWORD_REPEAT} from "../../validators";
import {formStyles, getLoginTextInputsStyleProps} from "../../styles/forms";
import {FormProps, Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import store from "../../state/store";
import {MyThunkDispatch, ValidatedActionReturn} from "../../state/types";
import {resetPassword} from "../../state/auth/actions";
import FormSubmitButton from "./FormSubmitButton";
import FormError from "./FormError";
import {generalError, localizeError} from "../../api/errors";
import {RemoteValidationErrors} from "../../api/dto";

type FormState = {
    password: string;
    passwordRepeat: string;
};

const initialState = (): FormState => ({
    password: "",
    passwordRepeat: "",
});

// Use Yup to create the validation schema
const ResetPasswordFormSchema = Yup.object().shape({
    password: VALIDATOR_PASSWORD_SIGNUP,
    passwordRepeat: VALIDATOR_PASSWORD_REPEAT,
});

// Component props
type ResetPasswordFormProps = {token?: string} & FormProps<FormState> & ThemeProps;

// Component state
type ResetPasswordFormState = {remoteErrors?: RemoteValidationErrors; submitting: boolean};

class ResetPasswordForm extends React.Component<ResetPasswordFormProps, ResetPasswordFormState> {
    setFieldError?: (field: string, message: string) => void;

    constructor(props: ResetPasswordFormProps) {
        super(props);
        this.state = {submitting: false};
    }

    submit(values: FormState) {
        const {token, onSuccessfulSubmit} = this.props;
        this.setState({...this.state, submitting: true});

        if (token) {
            (store.dispatch as MyThunkDispatch)(resetPassword(token, values.password)).then(
                ({success, errors}: ValidatedActionReturn) => {
                    if (success && onSuccessfulSubmit) onSuccessfulSubmit(values);
                    if (errors && errors.fields) {
                        const f = errors.fields;
                        Object.keys(f).forEach((e) => this.setFieldError && this.setFieldError(e, localizeError(f[e])));
                    }
                    this.setState({remoteErrors: errors, submitting: false});
                },
            );
        } else {
            this.setState({remoteErrors: {general: "error.reset_password_no_token", fields: {}}, submitting: false});
        }
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const {remoteErrors, submitting} = this.state;
        const styles = themedStyles(theme);
        const fstyles = formStyles(theme);

        return (
            <>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{i18n.t("resetPassword.title")}</Text>
                </View>
                <Formik
                    initialValues={initialState()}
                    validationSchema={ResetPasswordFormSchema}
                    validateOnChange={true}
                    validateOnBlur={false}
                    onSubmit={(values) => this.submit(values)}
                >
                    {(formikProps: FormikProps<FormState>) => {
                        const {
                            handleSubmit,
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            setFieldError,
                        } = formikProps;
                        const textInputProps = {handleChange, handleBlur, ...getLoginTextInputsStyleProps(theme, 15)};
                        this.setFieldError = setFieldError;

                        return (
                            <React.Fragment>
                                <FormTextInput
                                    field="password"
                                    placeholder={i18n.t("password")}
                                    error={errors.password}
                                    value={values.password}
                                    touched={touched.password}
                                    isPassword={true}
                                    {...textInputProps}
                                />

                                {/* TEMP This is a workaround for a bug on some iOS versions.
                                    See https://github.com/facebook/react-native/issues/21572 */}
                                <TextInput style={{width: 1, height: 1}} />

                                <FormTextInput
                                    field="passwordRepeat"
                                    placeholder={i18n.t("passwordRepeat")}
                                    error={errors.passwordRepeat}
                                    value={values.passwordRepeat}
                                    touched={touched.passwordRepeat}
                                    isPassword={true}
                                    {...textInputProps}
                                />

                                <FormError error={generalError(remoteErrors)} />

                                <View style={fstyles.actionRow}>
                                    <FormSubmitButton
                                        onPress={() => handleSubmit()}
                                        style={[fstyles.buttonMajor, styles.button]}
                                        textStyle={fstyles.buttonMajorText}
                                        text={i18n.t("resetPassword.button")}
                                        submitting={submitting}
                                    />
                                </View>
                            </React.Fragment>
                        );
                    }}
                </Formik>
            </>
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
