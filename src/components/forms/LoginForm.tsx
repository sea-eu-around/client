import * as React from "react";
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../FormTextInput";
import {StackNavigationProp} from "@react-navigation/stack";
import {LoginTabNavigatorScreens} from "../../navigation/types";
import {connect, ConnectedProps} from "react-redux";
import {AppState, MyThunkDispatch} from "../../state/types";
import {setTheme} from "../../state/settings/actions";
import {VALIDATOR_EMAIL_LOGIN, VALIDATOR_PASSWORD_LOGIN} from "../../validators";
import {formStyle, getLoginTextInputsStyleProps} from "../../styles/forms";
import {requestLogin} from "../../state/auth/actions";
import FormError from "./FormError";
import {FormProps, Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";

type LoginFormState = {
    email: string;
    password: string;
};

// Use Yup to create the validation schema
const LoginFormSchema = Yup.object().shape({
    email: VALIDATOR_EMAIL_LOGIN,
    password: VALIDATOR_PASSWORD_LOGIN,
});

// Map props from the store
const mapStateToProps = (state: AppState) => ({
    themeName: state.settings.theme,
    connecting: state.auth.connecting,
    remoteErrors: state.auth.loginErrors,
    validatedEmail: state.auth.validatedEmail,
});
const reduxConnector = connect(mapStateToProps);

// Component props
type LoginFormProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    FormProps<LoginFormState> & {navigation: StackNavigationProp<LoginTabNavigatorScreens, "LoginScreen">};

class LoginFormComponent extends React.Component<LoginFormProps> {
    setFieldValue: null | ((field: string, value: string, shouldValidate?: boolean | undefined) => void) = null;

    componentDidUpdate(oldProps: LoginFormProps) {
        const {validatedEmail} = this.props;
        if (this.setFieldValue && validatedEmail && oldProps.validatedEmail != validatedEmail)
            this.setFieldValue("email", validatedEmail);
    }

    submit(values: LoginFormState) {
        console.log("Login form submitted", values);
        (this.props.dispatch as MyThunkDispatch)(requestLogin(values.email, values.password));
        if (this.props.onSuccessfulSubmit !== undefined) this.props.onSuccessfulSubmit(values);
    }

    render(): JSX.Element {
        const {theme, themeName, dispatch, navigation, connecting, remoteErrors} = this.props;

        const styles = themedStyles(theme);

        return (
            <Formik
                initialValues={{email: "", password: ""} as LoginFormState}
                validationSchema={LoginFormSchema}
                validateOnBlur={false}
                onSubmit={(values: LoginFormState) => this.submit(values)}
            >
                {(formikProps: FormikProps<LoginFormState>) => {
                    const {
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                    } = formikProps;
                    const textInputProps = {handleChange, handleBlur, ...getLoginTextInputsStyleProps(theme, 15)};
                    this.setFieldValue = setFieldValue;

                    return (
                        <React.Fragment>
                            <FormTextInput
                                field="email"
                                placeholder={i18n.t("emailAddress")}
                                error={errors.email}
                                value={values.email}
                                touched={touched.email}
                                keyboardType="email-address"
                                autoCompleteType="email"
                                {...textInputProps}
                            />

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

                            <View style={formStyle.actionRow}>
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    accessibilityLabel={i18n.t("login")}
                                    onPress={() => handleSubmit()}
                                    style={[styles.loginButton]}
                                    disabled={connecting}
                                >
                                    {!connecting && <Text style={formStyle.buttonMajorText}>{i18n.t("login")}</Text>}
                                    {connecting && <ActivityIndicator size="large" color={theme.accentSecondary} />}
                                </TouchableOpacity>
                            </View>

                            <FormError error={remoteErrors.length > 0 ? remoteErrors[0] : ""} />

                            <TouchableOpacity
                                accessibilityRole="link"
                                accessibilityLabel={i18n.t("forgotPassword")}
                                onPress={() => {
                                    navigation.navigate("ForgotPassword");
                                }}
                                style={styles.forgotPwdLink}
                            >
                                <Text style={styles.forgotPasswordText}>{i18n.t("forgotPassword")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                accessibilityRole="link"
                                accessibilityLabel={"Toggle theme"}
                                onPress={() => {
                                    dispatch(setTheme(themeName == "light" ? "dark" : "light"));
                                }}
                                style={styles.forgotPwdLink}
                            >
                                <Text style={styles.forgotPasswordText}>Toggle Theme</Text>
                            </TouchableOpacity>
                        </React.Fragment>
                    );
                }}
            </Formik>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        loginButton: {
            ...formStyle.buttonMajor,
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

export const LoginForm = reduxConnector(withTheme(LoginFormComponent));
