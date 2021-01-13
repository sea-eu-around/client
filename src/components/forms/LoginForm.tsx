import * as React from "react";
import {Keyboard, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../forms/FormTextInput";
import {connect, ConnectedProps} from "react-redux";
import {AppState, MyThunkDispatch, ValidatedActionReturn} from "../../state/types";
import {VALIDATOR_EMAIL_LOGIN, VALIDATOR_PASSWORD_LOGIN} from "../../validators";
import {getLoginTextInputsStyleProps, formStyles} from "../../styles/forms";
import {requestLogin} from "../../state/auth/actions";
import FormError from "./FormError";
import {FormProps, Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {generalError, localizeError} from "../../api/errors";
import FormSubmitButton from "./FormSubmitButton";
import {RemoteValidationErrors} from "../../api/dto";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {rootNavigate} from "../../navigation/utils";
import Button from "../Button";

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
    FormProps<FormState> & {containerStyle?: StyleProp<ViewStyle>};

type LoginFormState = {remoteErrors?: RemoteValidationErrors; submitting: boolean};

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
    pwdInputRef = React.createRef<FormTextInput>();
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
        const {theme, containerStyle} = this.props;
        const {remoteErrors, submitting} = this.state;

        const styles = themedStyles(theme);
        const fstyles = formStyles(theme);

        return (
            <View style={[{width: "100%"}, containerStyle]}>
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
                        const textInputProps = {handleChange, handleBlur, ...getLoginTextInputsStyleProps(theme, 10)};
                        this.setFieldValue = setFieldValue;
                        this.setFieldError = setFieldError;

                        return (
                            <View>
                                <FormTextInput
                                    field="email"
                                    placeholder={i18n.t("emailAddress")}
                                    accessibilityLabel={i18n.t("emailAddress")}
                                    error={errors.email}
                                    value={values.email}
                                    touched={touched.email}
                                    isEmail={true}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => this.pwdInputRef.current?.focus()}
                                    icon={(focused) => (
                                        <MaterialIcons
                                            name="email"
                                            style={[
                                                fstyles.inputFieldIcon,
                                                focused ? fstyles.inputFieldIconFocused : {},
                                            ]}
                                        />
                                    )}
                                    {...textInputProps}
                                />

                                <FormTextInput
                                    ref={this.pwdInputRef}
                                    field="password"
                                    placeholder={i18n.t("password")}
                                    accessibilityLabel={i18n.t("password")}
                                    error={errors.password}
                                    value={values.password}
                                    touched={touched.password}
                                    isPassword={true}
                                    returnKeyType="done"
                                    icon={(focused) => (
                                        <MaterialIcons
                                            name="lock"
                                            style={[
                                                fstyles.inputFieldIcon,
                                                focused ? fstyles.inputFieldIconFocused : {},
                                            ]}
                                        />
                                    )}
                                    {...textInputProps}
                                />

                                <FormError error={generalError(remoteErrors)} />

                                <TouchableOpacity
                                    accessibilityRole="link"
                                    accessibilityLabel={i18n.t("forgotPassword")}
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        rootNavigate("LoginRoot", {
                                            screen: "LoginScreens",
                                            params: {screen: "ForgotPasswordScreen"},
                                        });
                                    }}
                                    style={styles.forgotPwdLink}
                                >
                                    <Text style={styles.forgotPasswordText}>{i18n.t("forgotPassword")}</Text>
                                </TouchableOpacity>

                                <View style={styles.actionsContainer}>
                                    <FormSubmitButton
                                        onPress={() => handleSubmit()}
                                        skin="rounded-filled"
                                        text={i18n.t("loginForm.logIn")}
                                        icon={<MaterialCommunityIcons name="login" style={styles.loginButtonIcon} />}
                                        submitting={submitting}
                                    />
                                    <View style={styles.separatorContainer}>
                                        <View style={styles.separatorHbar} />
                                        <Text style={styles.separatorText}>{i18n.t("loginForm.or")}</Text>
                                        <View style={styles.separatorHbar} />
                                    </View>
                                    <Button
                                        onPress={() => {
                                            Keyboard.dismiss();
                                            rootNavigate("LoginRoot", {
                                                screen: "LoginScreens",
                                                params: {screen: "SignupScreen"},
                                            });
                                        }}
                                        skin="rounded-hollow"
                                        text={i18n.t("loginForm.signUp")}
                                    />
                                </View>
                            </View>
                        );
                    }}
                </Formik>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        actionsContainer: {
            flexDirection: "column",
            width: "100%",
        },
        loginButtonIcon: {
            color: theme.textWhite,
            fontSize: 20,
            marginLeft: 5,
        },
        forgotPwdLink: {
            height: 48,
            justifyContent: "center",
            paddingHorizontal: 8, // make the button larger to click on
        },
        forgotPasswordText: {
            fontSize: 14,
            letterSpacing: 0.5,
            color: theme.textLight,
            textAlign: "center",
        },
        separatorContainer: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
        },
        separatorHbar: {
            flex: 1,
            height: 1,
            backgroundColor: theme.text,
            opacity: 0.2,
        },
        separatorText: {
            fontSize: 14,
            color: theme.textLight,
            paddingHorizontal: 10,
        },
    });
});

export default reduxConnector(withTheme(LoginForm));
