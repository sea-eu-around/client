import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../FormTextInput";
import {MyThunkDispatch, ValidatedActionReturn} from "../../state/types";
import {VALIDATOR_EMAIL_SIGNUP, VALIDATOR_PASSWORD_SIGNUP, VALIDATOR_PASSWORD_REPEAT} from "../../validators";
import {formStyles, getLoginTextInputsStyleProps} from "../../styles/forms";
import {FormProps, Theme, ThemeProps} from "../../types";
import {requestRegister} from "../../state/auth/actions";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import store from "../../state/store";
import FormError from "./FormError";
import {generalError, localizeError} from "../../api/errors";
import FormSubmitButton from "./FormSubmitButton";
import {RemoteValidationErrors} from "../../api/dto";

type FormState = {
    email: string;
    password: string;
    passwordRepeat: string;
};

const initialState = (): FormState => ({
    email: "",
    password: "",
    passwordRepeat: "",
});

// Use Yup to create the validation schema
const SignupFormSchema = Yup.object().shape({
    email: VALIDATOR_EMAIL_SIGNUP,
    password: VALIDATOR_PASSWORD_SIGNUP,
    passwordRepeat: VALIDATOR_PASSWORD_REPEAT,
});

// Component props
type SignupFormProps = FormProps<FormState> & ThemeProps;

// Component state
type SignupFormState = {remoteErrors?: RemoteValidationErrors; submitting: boolean};

class SignupForm extends React.Component<SignupFormProps, SignupFormState> {
    setFieldError?: (field: string, message: string) => void;

    constructor(props: SignupFormProps) {
        super(props);
        this.state = {submitting: false};
    }

    submit(values: FormState) {
        this.setState({...this.state, submitting: true});
        (store.dispatch as MyThunkDispatch)(requestRegister(values.email, values.password)).then(
            ({success, errors}: ValidatedActionReturn) => {
                if (success && this.props.onSuccessfulSubmit) this.props.onSuccessfulSubmit(values);
                if (errors && errors.fields) {
                    const f = errors.fields;
                    Object.keys(f).forEach((e) => this.setFieldError && this.setFieldError(e, localizeError(f[e])));
                }
                this.setState({remoteErrors: errors, submitting: false});
            },
        );
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const {remoteErrors, submitting} = this.state;
        const styles = themedStyles(theme);
        const fstyles = formStyles(theme);

        return (
            <React.Fragment>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{i18n.t("signupWelcome")}</Text>
                </View>
                <Formik
                    initialValues={initialState()}
                    validationSchema={SignupFormSchema}
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
                                    field="email"
                                    placeholder={i18n.t("emailAddress")}
                                    accessibilityLabel={i18n.t("emailAddress")}
                                    error={errors.email}
                                    value={values.email}
                                    touched={touched.email}
                                    isEmail={true}
                                    {...textInputProps}
                                />

                                <FormTextInput
                                    field="password"
                                    placeholder={i18n.t("password")}
                                    accessibilityLabel={i18n.t("password")}
                                    error={errors.password}
                                    value={values.password}
                                    touched={touched.password}
                                    isPassword={true}
                                    {...textInputProps}
                                />

                                <FormTextInput
                                    field="passwordRepeat"
                                    placeholder={i18n.t("passwordRepeat")}
                                    accessibilityLabel={i18n.t("passwordRepeat")}
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
                                        style={[fstyles.buttonMajor, styles.createAccountButton]}
                                        textStyle={fstyles.buttonMajorText}
                                        text={i18n.t("createAccount")}
                                        submitting={submitting}
                                    />
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
        inlineInputs: {
            flex: 1,
        },
        inlineInputLeft: {
            marginRight: 5,
        },
        inlineInputRight: {
            marginLeft: 5,
        },
        createAccountButton: {
            width: "60%",
            backgroundColor: theme.accent,
        },
    });
});

export default withTheme(SignupForm);
