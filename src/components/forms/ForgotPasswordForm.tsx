import * as React from "react";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../forms/FormTextInput";
import {StackNavigationProp} from "@react-navigation/stack";
import {formStyles, getLoginTextInputsStyleProps} from "../../styles/forms";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {VALIDATOR_EMAIL_LOGIN} from "../../validators";
import {preTheme} from "../../styles/utils";
import store from "../../state/store";
import {MyThunkDispatch, ValidatedActionReturn} from "../../state/types";
import {forgotPassword} from "../../state/auth/actions";
import {TabLoginSigninScreens} from "../../navigation/types";
import {generalError, localizeError} from "../../api/errors";
import FormError from "./FormError";
import FormSubmitButton from "./FormSubmitButton";
import {RemoteValidationErrors} from "../../api/dto";

type FormState = {
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

// Component state
export type ForgotPasswordFormState = {remoteErrors?: RemoteValidationErrors; submitting: boolean};

class ForgotPasswordForm extends React.Component<ForgotPasswordFormProps, ForgotPasswordFormState> {
    setFieldError?: (field: string, message: string) => void;

    constructor(props: ForgotPasswordFormProps) {
        super(props);
        this.state = {submitting: false};
    }

    submit({email}: FormState) {
        this.setState({...this.state, submitting: true});
        (store.dispatch as MyThunkDispatch)(forgotPassword(email)).then(({errors}: ValidatedActionReturn) => {
            if (errors && errors.fields) {
                const f = errors.fields;
                Object.keys(f).forEach((e) => this.setFieldError && this.setFieldError(e, localizeError(f[e])));
            }
            this.setState({remoteErrors: errors, submitting: false});
        });
    }

    render(): JSX.Element {
        const {theme, navigation} = this.props;
        const {remoteErrors, submitting} = this.state;
        const styles = themedStyles(theme);
        const fstyles = formStyles(theme);

        return (
            <React.Fragment>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{i18n.t("newPassword")}</Text>
                    <Text style={styles.description}>{i18n.t("forgotPasswordExplanation")}</Text>
                </View>
                <Formik
                    initialValues={{email: ""} as FormState}
                    validationSchema={ForgotPasswordFormSchema}
                    validateOnBlur={false}
                    onSubmit={(values) => this.submit(values)}
                >
                    {(formikCfg: FormikProps<FormState>) => {
                        const {
                            handleSubmit,
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            setFieldError,
                        } = formikCfg;
                        const textInputProps = {handleChange, handleBlur, ...getLoginTextInputsStyleProps(theme)};
                        this.setFieldError = setFieldError;

                        return (
                            <React.Fragment>
                                <FormTextInput
                                    field="email"
                                    placeholder={i18n.t("emailAddress")}
                                    error={errors.email}
                                    value={values.email}
                                    touched={touched.email}
                                    isEmail={true}
                                    {...textInputProps}
                                />

                                <FormError error={generalError(remoteErrors)} />

                                <View style={fstyles.actionRow}>
                                    <TouchableOpacity
                                        accessibilityRole="button"
                                        accessibilityLabel={i18n.t("cancel")}
                                        onPress={() => navigation.goBack()}
                                        style={[fstyles.buttonMajor, styles.buttonCancel]}
                                    >
                                        <Text style={fstyles.buttonMajorText}>{i18n.t("cancel")}</Text>
                                    </TouchableOpacity>
                                    <FormSubmitButton
                                        onPress={() => handleSubmit()}
                                        style={[fstyles.buttonMajor, styles.buttonSend]}
                                        textStyle={fstyles.buttonMajorText}
                                        text={i18n.t("send")}
                                        submitting={submitting}
                                    />
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
