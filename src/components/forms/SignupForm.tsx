import * as React from "react";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../FormTextInput";
import {AppState, MyThunkDispatch} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {VALIDATOR_EMAIL_SIGNUP, VALIDATOR_PASSWORD_SIGNUP, VALIDATOR_PASSWORD_REPEAT} from "../../validators";
import {formStyle, getLoginTextInputsStyleProps} from "../../styles/forms";
import {FormProps, Theme, ThemeProps} from "../../types";
import {requestRegister} from "../../state/auth/actions";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";

export type SignupFormState = {
    email: string;
    password: string;
    passwordRepeat: string;
};

const initialState = (): SignupFormState => ({
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

// Map props from the store
const mapStateToProps = (state: AppState) => ({
    registerFailure: state.auth.registerFailure,
    registerErrors: state.auth.registerErrors,
});
const reduxConnector = connect(mapStateToProps);

// Component props
type SignupFormProps = FormProps<SignupFormState> & ConnectedProps<typeof reduxConnector> & ThemeProps;

class SignupForm extends React.Component<SignupFormProps> {
    submit(values: SignupFormState) {
        console.log("Signup form submitted", values);
        (this.props.dispatch as MyThunkDispatch)(requestRegister(values.email, values.password));
        if (this.props.onSuccessfulSubmit !== undefined) this.props.onSuccessfulSubmit(values);
    }

    componentDidUpdate(/*prevProps: SignupFormProps*/) {
        if (this.props.registerFailure) {
            /*const errorTexts = this.props.registerErrors.map((err: string, i: number) => (
                <Text key={i} style={[formStyle.errorText, {color: this.props.theme.error}]}>
                    {err}
                </Text>
            ));*/

            Alert.alert("Unable to register", this.props.registerErrors[0], [
                {text: "OK", onPress: () => console.log("OK Pressed")},
            ]);
        }
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

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
                    onSubmit={(values: SignupFormState) => this.submit(values)}
                >
                    {(formikProps: FormikProps<SignupFormState>) => {
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

                                <View style={formStyle.actionRow}>
                                    <TouchableOpacity
                                        accessibilityRole="button"
                                        accessibilityLabel={i18n.t("createAccount")}
                                        onPress={() => handleSubmit()}
                                        style={styles.createAccountButton}
                                    >
                                        <Text style={formStyle.buttonMajorText}>{i18n.t("createAccount")}</Text>
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
            ...formStyle.buttonMajor,
            width: "60%",
            backgroundColor: theme.accent,
        },
    });
});

export default reduxConnector(withTheme(SignupForm));
