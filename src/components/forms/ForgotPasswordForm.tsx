import * as React from "react";
import {Text, View, StyleSheet, StyleProp, ViewStyle, Keyboard} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../forms/FormTextInput";
import {getLoginTextInputsStyleProps, loginTabsStyles} from "../../styles/forms";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {VALIDATOR_EMAIL_LOGIN} from "../../validators";
import {preTheme} from "../../styles/utils";
import store from "../../state/store";
import {MyThunkDispatch, ValidatedActionReturn} from "../../state/types";
import {forgotPassword} from "../../state/auth/actions";
import {generalError, localizeError} from "../../api/errors";
import FormError from "./FormError";
import FormSubmitButton from "./FormSubmitButton";
import {RemoteValidationErrors} from "../../api/dto";
import {navigateBack} from "../../navigation/utils";
import Button from "../Button";

type FormState = {
    email: string;
};

// Use Yup to create the validation schema
const ForgotPasswordFormSchema = Yup.object().shape({
    email: VALIDATOR_EMAIL_LOGIN,
});

// Component props
export type ForgotPasswordFormProps = ThemeProps & {containerStyle?: StyleProp<ViewStyle>};

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
        const {theme, containerStyle} = this.props;
        const {remoteErrors, submitting} = this.state;
        const styles = themedStyles(theme);
        const lstyles = loginTabsStyles(theme);

        return (
            <View style={[{width: "100%"}, containerStyle]}>
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
                            <>
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

                                <View style={[lstyles.actionsContainer, styles.actionsContainer]}>
                                    <FormSubmitButton
                                        onPress={() => {
                                            Keyboard.dismiss();
                                            handleSubmit();
                                        }}
                                        style={[lstyles.actionButton, lstyles.actionButtonFilled]}
                                        textStyle={[lstyles.actionText, lstyles.actionTextFilled]}
                                        text={i18n.t("send")}
                                        //icon={<MaterialCommunityIcons name="login" style={styles.loginButtonIcon} />}
                                        submitting={submitting}
                                    />
                                    <Button
                                        onPress={() => {
                                            Keyboard.dismiss();
                                            navigateBack();
                                        }}
                                        style={lstyles.actionButton}
                                        textStyle={lstyles.actionText}
                                        text={i18n.t("cancel")}
                                    />
                                </View>
                            </>
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
            marginTop: 40,
        },
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
