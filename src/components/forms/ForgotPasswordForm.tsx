import * as React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import themes from "../../constants/themes";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../FormTextInput";
import {StackNavigationProp} from "@react-navigation/stack";
import {LoginTabNavigatorScreens} from "../../navigation/types";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {VALIDATOR_EMAIL} from "../../validators";
import {formStyle, getLoginTextInputsStyleProps} from "../../styles/forms";

type ForgotPasswordFormState = {
    email: string;
};

// Use Yup to create the validation schema
const ForgotPasswordFormSchema = Yup.object().shape({
    email: VALIDATOR_EMAIL,
});

// Form submission handler
function submitForm({email}: ForgotPasswordFormState) {
    console.log("Reset Password form submitted", email);
}

// Map props from the store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
export type ForgotPasswordFormProps = ConnectedProps<typeof reduxConnector> & {
    navigation: StackNavigationProp<LoginTabNavigatorScreens, "ForgotPassword">;
};

function ForgotPasswordForm({theme, navigation}: ForgotPasswordFormProps): JSX.Element {
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
        description: {
            textAlign: "justify",
            fontSize: 16,
            marginTop: 10,
            color: theme.textLight,
        },
        buttonSend: {
            flex: 1,
            backgroundColor: theme.accent,
            marginLeft: 6,
        },
        buttonCancel: {
            flex: 1,
            backgroundColor: theme.actionNeutral,
            marginRight: 6,
        },
    });

    return (
        <React.Fragment>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>{i18n.t("newPassword")}</Text>
                <Text style={styles.description}>{i18n.t("forgotPasswordExplanation")}</Text>
            </View>
            <Formik
                initialValues={{email: ""} as ForgotPasswordFormState}
                validationSchema={ForgotPasswordFormSchema}
                validateOnBlur={false}
                onSubmit={submitForm}
            >
                {(formikCfg: FormikProps<ForgotPasswordFormState>) => {
                    const {handleSubmit, values, errors, touched, handleChange, handleBlur} = formikCfg;
                    const textInputProps = {handleChange, handleBlur, ...getLoginTextInputsStyleProps(theme)};

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

                            <View style={formStyle.actionRow}>
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    accessibilityLabel={i18n.t("cancel")}
                                    onPress={() => navigation.goBack()}
                                    style={[formStyle.buttonMajor, styles.buttonCancel]}
                                >
                                    <Text style={formStyle.buttonMajorText}>{i18n.t("cancel")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    accessibilityLabel={i18n.t("send")}
                                    onPress={() => handleSubmit()}
                                    style={[formStyle.buttonMajor, styles.buttonSend]}
                                >
                                    <Text style={formStyle.buttonMajorText}>{i18n.t("send")}</Text>
                                </TouchableOpacity>
                            </View>
                        </React.Fragment>
                    );
                }}
            </Formik>
        </React.Fragment>
    );
}

export default reduxConnector(ForgotPasswordForm);
