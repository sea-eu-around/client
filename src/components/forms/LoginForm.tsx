import * as React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../../constants/themes";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../FormTextInput";
import {StackNavigationProp} from "@react-navigation/stack";
import {LoginTabNavigatorScreens, FormProps} from "../../types";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import {setTheme} from "../../state/theming/actions";
import {VALIDATOR_EMAIL, VALIDATOR_PASSWORD} from "../../validators";
import {formStyle, getLoginTextInputsStyleProps} from "../../styles/forms";

type LoginFormState = {
    email: string;
    password: string;
};

// Use Yup to create the validation schema
const LoginFormSchema = Yup.object().shape({
    email: VALIDATOR_EMAIL,
    password: VALIDATOR_PASSWORD,
});

// Form submission handler
const submitForm = (onSuccessfulSubmit?: (values: LoginFormState) => void) => (values: LoginFormState) => {
    const {email, password} = values;
    console.log("Login form submitted", email, password);
    if (onSuccessfulSubmit) onSuccessfulSubmit(values);
};

// Map props from the store
const mapStateToProps = (state: AppState) => ({
    themeName: state.theming.theme,
    theme: Colors[state.theming.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
type LoginFormProps = ConnectedProps<typeof reduxConnector> &
    FormProps<LoginFormState> & {navigation: StackNavigationProp<LoginTabNavigatorScreens, "LoginScreen">};

function LoginFormComponent({theme, themeName, onSuccessfulSubmit, dispatch, navigation}: LoginFormProps): JSX.Element {
    const styles = StyleSheet.create({
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

    return (
        <Formik
            initialValues={{email: "", password: ""} as LoginFormState}
            validationSchema={LoginFormSchema}
            validateOnBlur={false}
            onSubmit={submitForm(onSuccessfulSubmit)} // eslint-disable-line @typescript-eslint/no-empty-function
        >
            {(formikProps: FormikProps<LoginFormState>) => {
                const {handleSubmit, values, errors, touched, handleChange, handleBlur} = formikProps;
                const textInputProps = {handleChange, handleBlur, ...getLoginTextInputsStyleProps(theme, 15)};

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
                                style={[formStyle.buttonMajor, styles.loginButton]}
                            >
                                <Text style={formStyle.buttonMajorText}>{i18n.t("login")}</Text>
                            </TouchableOpacity>
                        </View>

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

export const LoginForm = reduxConnector(LoginFormComponent);
