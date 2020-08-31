import * as React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "./FormTextInput";
import {FormCheckBox} from "./FormCheckBox";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {connect, ConnectedProps} from "react-redux";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_PASSWORD,
    VALIDATOR_PASSWORD_REPEAT,
    VALIDATOR_FIRSTNAME,
    VALIDATOR_LASTNAME,
    VALIDATOR_TOS,
} from "../validators";
import {formStyle, getLoginTextInputsStyleProps, getLoginCheckBoxStyleProps} from "../styles/forms";

type SignupFormState = {
    email: string;
    password: string;
    passwordRepeat: string;
    firstname: string;
    lastname: string;
    tos: boolean;
    emailNotifications: boolean;
};

const initialState = (): SignupFormState => ({
    email: "",
    password: "",
    passwordRepeat: "",
    firstname: "",
    lastname: "",
    tos: false,
    emailNotifications: true,
});

// Use Yup to create the validation schema
const SignupFormSchema = Yup.object().shape({
    email: VALIDATOR_EMAIL,
    password: VALIDATOR_PASSWORD,
    passwordRepeat: VALIDATOR_PASSWORD_REPEAT,
    firstname: VALIDATOR_FIRSTNAME,
    lastname: VALIDATOR_LASTNAME,
    tos: VALIDATOR_TOS,
});

function setNamesFromEmail(email: string, {setFieldValue, setFieldTouched}: FormikProps<SignupFormState>) {
    const splitName = email.split("@")[0].split(".");
    const capitalize = (str: string) => (str.length == 0 ? str : str[0].toUpperCase() + str.slice(1));
    if (splitName.length >= 2) {
        setFieldValue("firstname", capitalize(splitName[0]));
        setFieldValue("lastname", capitalize(splitName[1]));
        // Workaround for a Formik bug (ensures validation is properly ran). See https://github.com/formium/formik/issues/2059
        setTimeout(() => {
            setFieldTouched("firstname", true, true);
            setFieldTouched("lastname", true, true);
        });
    }
}

// Form submission handler
function submitForm(values: SignupFormState) {
    console.log("Signup form submitted", values);
}

// Map props from the store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.theming.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
type SignupFormProps = ConnectedProps<typeof reduxConnector>;

function SignupForm({theme}: SignupFormProps): JSX.Element {
    const styles = StyleSheet.create({
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
                onSubmit={submitForm}
            >
                {(formikProps: FormikProps<SignupFormState>) => {
                    const {
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        setFieldTouched,
                    } = formikProps;
                    const textInputProps = {handleChange, handleBlur, ...getLoginTextInputsStyleProps(theme)};
                    const checkBoxProps = {setFieldValue, setFieldTouched, ...getLoginCheckBoxStyleProps(theme)};

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
                                onBlur={() => {
                                    if (!errors.email && values.firstname == "" && values.lastname == "")
                                        setNamesFromEmail(values.email, formikProps);
                                }}
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

                            <View style={formStyle.inputRow}>
                                <FormTextInput
                                    field="firstname"
                                    placeholder={i18n.t("firstname")}
                                    error={errors.firstname}
                                    value={values.firstname}
                                    touched={touched.firstname}
                                    autoCompleteType="name"
                                    {...textInputProps}
                                    wrapperStyle={[
                                        textInputProps.wrapperStyle,
                                        styles.inlineInputs,
                                        styles.inlineInputLeft,
                                    ]}
                                />

                                <FormTextInput
                                    field="lastname"
                                    placeholder={i18n.t("lastname")}
                                    error={errors.lastname}
                                    value={values.lastname}
                                    touched={touched.lastname}
                                    autoCompleteType="name"
                                    {...textInputProps}
                                    wrapperStyle={[
                                        textInputProps.wrapperStyle,
                                        styles.inlineInputs,
                                        styles.inlineInputRight,
                                    ]}
                                />
                            </View>

                            <FormCheckBox
                                field="tos"
                                label={i18n.t("tosLabel")}
                                error={errors.tos}
                                value={values.tos}
                                touched={touched.tos}
                                {...checkBoxProps}
                            />

                            <FormCheckBox
                                field="emailNotifications"
                                label={i18n.t("emailNotificationsLabel")}
                                error={errors.emailNotifications}
                                value={values.emailNotifications}
                                touched={touched.emailNotifications}
                                {...checkBoxProps}
                            />

                            <View style={formStyle.actionRow}>
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    accessibilityLabel={i18n.t("createAccount")}
                                    onPress={() => handleSubmit()}
                                    style={[formStyle.buttonMajor, styles.createAccountButton]}
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

export default reduxConnector(SignupForm);
