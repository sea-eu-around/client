import * as React from "react";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../FormTextInput";
import {StackNavigationProp} from "@react-navigation/stack";
import {formStyles, getLoginTextInputsStyleProps} from "../../styles/forms";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {VALIDATOR_EMAIL_LOGIN} from "../../validators";
import {preTheme} from "../../styles/utils";
import store from "../../state/store";
import {MyThunkDispatch} from "../../state/types";
import {forgotPassword} from "../../state/auth/actions";
import {TabLoginSigninScreens} from "../../navigation/types";

type ForgotPasswordFormState = {
    email: string;
};

// Use Yup to create the validation schema
const ForgotPasswordFormSchema = Yup.object().shape({
    email: VALIDATOR_EMAIL_LOGIN,
});

// Component props
export type ForgotPasswordFormProps = ThemeProps & {
    navigation: StackNavigationProp<TabLoginSigninScreens, "ForgotPassword">;
};

class ForgotPasswordForm extends React.Component<ForgotPasswordFormProps> {
    // Form submission handler
    submitForm({email}: ForgotPasswordFormState) {
        (store.dispatch as MyThunkDispatch)(forgotPassword(email));
    }

    render(): JSX.Element {
        const {theme, navigation} = this.props;
        const styles = themedStyles(theme);
        const fstyles = formStyles(theme);

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
                    onSubmit={this.submitForm}
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

                                <View style={fstyles.actionRow}>
                                    <TouchableOpacity
                                        accessibilityRole="button"
                                        accessibilityLabel={i18n.t("cancel")}
                                        onPress={() => navigation.goBack()}
                                        style={[fstyles.buttonMajor, styles.buttonCancel]}
                                    >
                                        <Text style={fstyles.buttonMajorText}>{i18n.t("cancel")}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        accessibilityRole="button"
                                        accessibilityLabel={i18n.t("send")}
                                        onPress={() => handleSubmit()}
                                        style={[fstyles.buttonMajor, styles.buttonSend]}
                                    >
                                        <Text style={fstyles.buttonMajorText}>{i18n.t("send")}</Text>
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
});

export default withTheme(ForgotPasswordForm);
