import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../forms/FormTextInput";
import {VALIDATOR_PASSWORD_LOGIN} from "../../validators";
import {getLoginTextInputsStyleProps} from "../../styles/forms";
import {FormProps, Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import store from "../../state/store";
import {MyThunkDispatch, ValidatedActionReturn} from "../../state/types";
import FormSubmitButton from "./FormSubmitButton";
import FormError from "./FormError";
import {generalError, localizeError} from "../../api/errors";
import {RemoteValidationErrors} from "../../api/dto";
import {MaterialIcons} from "@expo/vector-icons";
import {deleteAccount} from "../../state/auth/actions";

type FormState = {password: string};

const initialState = (): FormState => ({password: ""});

// Use Yup to create the validation schema
const DeleteAccountFormSchema = Yup.object().shape({
    password: VALIDATOR_PASSWORD_LOGIN,
});

// Component props
type DeleteAccountFormProps = FormProps<FormState> & ThemeProps;

// Component state
type DeleteAccountFormState = {remoteErrors?: RemoteValidationErrors; submitting: boolean};

class DeleteAccountForm extends React.Component<DeleteAccountFormProps, DeleteAccountFormState> {
    setFieldError?: (field: string, message: string) => void;

    constructor(props: DeleteAccountFormProps) {
        super(props);
        this.state = {submitting: false};
    }

    submit(values: FormState) {
        const {onSuccessfulSubmit} = this.props;
        this.setState({...this.state, submitting: true});
        (store.dispatch as MyThunkDispatch)(deleteAccount(values.password)).then(
            ({success, errors}: ValidatedActionReturn) => {
                if (success && onSuccessfulSubmit) onSuccessfulSubmit(values);
                if (errors && errors.fields) {
                    const f = errors.fields;
                    Object.keys(f).forEach((e) => this.setFieldError && this.setFieldError(e, localizeError(f[e])));
                }
                this.setState({remoteErrors: errors, submitting: false});
            },
        );
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const {remoteErrors, submitting} = this.state;
        const styles = themedStyles(theme);

        return (
            <>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{i18n.t("deleteAccount.title")}</Text>
                    <MaterialIcons name="warning" style={styles.warningIcon} />
                    <Text style={styles.warning}>{i18n.t("deleteAccount.warning")}</Text>
                </View>
                <Formik
                    initialValues={initialState()}
                    validationSchema={DeleteAccountFormSchema}
                    validateOnChange={true}
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
                            setFieldError,
                        } = formikProps;
                        const textInputProps = {handleChange, handleBlur, ...getLoginTextInputsStyleProps(theme, 15)};
                        this.setFieldError = setFieldError;

                        return (
                            <>
                                <FormTextInput
                                    field="password"
                                    placeholder={i18n.t("password")}
                                    error={errors.password}
                                    value={values.password}
                                    touched={touched.password}
                                    label={i18n.t("deleteAccount.inputLabel")}
                                    isPassword={true}
                                    {...textInputProps}
                                />

                                <FormError error={generalError(remoteErrors)} />

                                <FormSubmitButton
                                    onPress={() => handleSubmit()}
                                    style={styles.button}
                                    skin="rounded-filled"
                                    text={i18n.t("deleteAccount.button")}
                                    submitting={submitting}
                                />
                            </>
                        );
                    }}
                </Formik>
            </>
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
        warning: {
            fontSize: 16,
            color: theme.text,
            textAlign: "justify",
        },
        warningIcon: {
            color: theme.warn,
            fontSize: 32,
            marginTop: 20,
        },
        button: {
            backgroundColor: theme.error,
            marginTop: 30,
        },
    });
});

export default withTheme(DeleteAccountForm);
