import * as React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../FormTextInput";
import {StackNavigationProp} from "@react-navigation/stack";
import {connect, ConnectedProps} from "react-redux";
import {AppState, MyThunkDispatch, ValidatedActionReturn} from "../../state/types";
import {VALIDATOR_EMAIL_LOGIN, VALIDATOR_PASSWORD_LOGIN} from "../../validators";
import {formStyles, getLoginTextInputsStyleProps} from "../../styles/forms";
import {requestLogin} from "../../state/auth/actions";
import FormError from "./FormError";
import {FormProps, Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {TabLoginSigninScreens} from "../../navigation/types";
import {generalError, localizeError} from "../../api/errors";
import FormSubmitButton from "./FormSubmitButton";
import {RemoteValidationErrors} from "../../api/dto";

type FormState = {
    email: string;
    password: string;
};

// Use Yup to create the validation schema
const LoginFormSchema = Yup.object().shape({
    email: VALIDATOR_EMAIL_LOGIN,
    password: VALIDATOR_PASSWORD_LOGIN,
});

// Map props from the store
const reduxConnector = connect((state: AppState) => ({
    validatedEmail: state.auth.validatedEmail,
}));

// Component props
type LoginFormProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    FormProps<FormState> & {navigation: StackNavigationProp<TabLoginSigninScreens, "LoginForm">};

type LoginFormState = {remoteErrors?: RemoteValidationErrors; submitting: boolean};

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
    setFieldError?: (field: string, message: string) => void;
    setFieldValue: null | ((field: string, value: string, shouldValidate?: boolean | undefined) => void) = null;

    constructor(props: LoginFormProps) {
        super(props);
        this.state = {submitting: false};
    }

    componentDidUpdate(oldProps: LoginFormProps) {
        const {validatedEmail} = this.props;
        if (this.setFieldValue && validatedEmail && oldProps.validatedEmail != validatedEmail)
            this.setFieldValue("email", validatedEmail);
    }

    submit(values: FormState) {
        this.setState({...this.state, submitting: true});
        (this.props.dispatch as MyThunkDispatch)(requestLogin(values.email, values.password)).then(
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
        const {theme, navigation} = this.props;
        const {remoteErrors, submitting} = this.state;

        const styles = themedStyles(theme);
        const fstyles = formStyles(theme);

        return (
            <Formik
                initialValues={{email: "", password: ""} as FormState}
                validationSchema={LoginFormSchema}
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
                        setFieldValue,
                        setFieldError,
                    } = formikProps;
                    const textInputProps = {handleChange, handleBlur, ...getLoginTextInputsStyleProps(theme, 15)};
                    this.setFieldValue = setFieldValue;
                    this.setFieldError = setFieldError;

                    return (
                        <>
                            <FormTextInput
                                field="email"
                                placeholder={i18n.t("emailAddress")}
                                error={errors.email}
                                value={values.email}
                                touched={touched.email}
                                isEmail={true}
                                {...textInputProps}
                            />

                            <FormTextInput
                                field="password"
                                placeholder={i18n.t("password")}
                                error={errors.password}
                                value={values.password}
                                touched={touched.password}
                                isPassword={true}
                                {...textInputProps}
                            />

                            <FormError error={generalError(remoteErrors)} />

                            <View style={fstyles.actionRow}>
                                <FormSubmitButton
                                    onPress={() => handleSubmit()}
                                    style={[fstyles.buttonMajor, styles.loginButton]}
                                    textStyle={fstyles.buttonMajorText}
                                    text={i18n.t("login")}
                                    submitting={submitting}
                                />
                            </View>

                            <TouchableOpacity
                                accessibilityRole="link"
                                accessibilityLabel={i18n.t("forgotPassword")}
                                onPress={() => navigation.navigate("ForgotPassword")}
                                style={styles.forgotPwdLink}
                            >
                                <Text style={styles.forgotPasswordText}>{i18n.t("forgotPassword")}</Text>
                            </TouchableOpacity>
                        </>
                    );
                }}
            </Formik>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        loginButton: {
            width: "60%",
            backgroundColor: theme.accent,
        },
        forgotPwdLink: {
            marginTop: 40,
            padding: 8, // make the button larger to click on
        },
        forgotPasswordText: {
            fontSize: 14,
            letterSpacing: 0.5,
            color: theme.textLight,
        },
    });
});

export default reduxConnector(withTheme(LoginForm));
