import * as React from "react";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../FormTextInput";
import {MyThunkDispatch} from "../../state/types";
import {VALIDATOR_EMAIL_SIGNUP, VALIDATOR_PASSWORD_SIGNUP, VALIDATOR_PASSWORD_REPEAT} from "../../validators";
import {formStyles, getLoginTextInputsStyleProps} from "../../styles/forms";
import {FailableActionReturn, FormProps, Theme, ThemeProps} from "../../types";
import {requestRegister} from "../../state/auth/actions";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import store from "../../state/store";

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

// Component props
type SignupFormProps = FormProps<SignupFormState> & ThemeProps;

// Component state
type SignupFormComponentState = {failure: boolean; errors?: string[]};

class SignupForm extends React.Component<SignupFormProps, SignupFormComponentState> {
    constructor(props: SignupFormProps) {
        super(props);
        this.state = {failure: false};
    }

    submit(values: SignupFormState) {
        (store.dispatch as MyThunkDispatch)(requestRegister(values.email, values.password)).then(
            ({success, errors}: FailableActionReturn) => {
                if (success && this.props.onSuccessfulSubmit) this.props.onSuccessfulSubmit(values);
                this.setState({...this.state, failure: !success, errors});
            },
        );
    }

    componentDidUpdate() {
        const {failure, errors} = this.state;
        if (failure) {
            /*const errorTexts = this.props.registerErrors.map((err: string, i: number) => (
                <Text key={i} style={[formStyle.errorText, {color: this.props.theme.error}]}>
                    {err}
                </Text>
            ));*/

            Alert.alert("Unable to register", errors && errors.length > 0 ? errors[0] : "", [
                {text: "OK", onPress: () => console.log("OK Pressed")},
            ]);
        }
    }

    render(): JSX.Element {
        const {theme} = this.props;
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

                                <View style={fstyles.actionRow}>
                                    <TouchableOpacity
                                        accessibilityRole="button"
                                        accessibilityLabel={i18n.t("createAccount")}
                                        onPress={() => handleSubmit()}
                                        style={[fstyles.buttonMajor, styles.createAccountButton]}
                                    >
                                        <Text style={fstyles.buttonMajorText}>{i18n.t("createAccount")}</Text>
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
            width: "60%",
            backgroundColor: theme.accent,
        },
    });
});

export default withTheme(SignupForm);
