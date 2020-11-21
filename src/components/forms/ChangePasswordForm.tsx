import * as React from "react";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../FormTextInput";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {VALIDATOR_PASSWORD_SIGNUP, VALIDATOR_PASSWORD_REPEAT} from "../../validators";
import {formStyle, getLoginTextInputsStyleProps} from "../../styles/forms";
import {FormProps, Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";

export type ChangePasswordFormState = {
    password: string;
    passwordRepeat: string;
};

const initialState = (): ChangePasswordFormState => ({
    password: "",
    passwordRepeat: "$1",
});

// Use Yup to create the validation schema
const ChangePasswordFormSchema = Yup.object().shape({
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
type ChangePasswordFormProps = FormProps<ChangePasswordFormState> & ConnectedProps<typeof reduxConnector> & ThemeProps;

class ChangePasswordForm extends React.Component<ChangePasswordFormProps> {
    submit(values: ChangePasswordFormState) {
        console.log("Change pwd form submitted", values);
        //(this.props.dispatch as MyThunkDispatch)(requestRegister(values.email, values.password));
        //if (this.props.onSuccessfulSubmit !== undefined) this.props.onSuccessfulSubmit(values);
    }

    componentDidUpdate(/*prevProps: SignupFormProps*/) {
        if (this.props.registerFailure) {
            /*const errorTexts = this.props.registerErrors.map((err: string, i: number) => (
                <Text key={i} style={[formStyle.errorText, {color: this.props.theme.error}]}>
                    {err}
                </Text>
            ));*/

            Alert.alert("Unable to change password", this.props.registerErrors[0], [
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
                    validationSchema={ChangePasswordFormSchema}
                    validateOnChange={true}
                    validateOnBlur={false}
                    onSubmit={(values: ChangePasswordFormState) => this.submit(values)}
                >
                    {(formikProps: FormikProps<ChangePasswordFormState>) => {
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

export default reduxConnector(withTheme(ChangePasswordForm));
