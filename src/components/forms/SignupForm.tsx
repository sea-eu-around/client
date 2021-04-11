import * as React from "react";
import {StyleProp, StyleSheet, Text, TextInput, View, ViewStyle, Keyboard} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../forms/FormTextInput";
import {MyThunkDispatch, ValidatedActionReturn} from "../../state/types";
import {VALIDATOR_EMAIL_SIGNUP, VALIDATOR_PASSWORD_SIGNUP, VALIDATOR_PASSWORD_REPEAT} from "../../validators";
import {getLoginTextInputsStyleProps, formStyles} from "../../styles/forms";
import {FormProps, Theme, ThemeProps} from "../../types";
import {requestRegister} from "../../state/auth/actions";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import store from "../../state/store";
import FormError from "./FormError";
import {generalError, localizeError} from "../../api/errors";
import FormSubmitButton from "./FormSubmitButton";
import {RemoteValidationErrors} from "../../api/dto";
import {MaterialIcons} from "@expo/vector-icons";
import {navigateBack} from "../../navigation/utils";
import Button from "../Button";

type FormState = {
    email: string;
    password: string;
    passwordRepeat: string;
};

const initialState = (): FormState => ({
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
type SignupFormProps = FormProps<FormState> & ThemeProps & {containerStyle?: StyleProp<ViewStyle>};

// Component state
type SignupFormState = {remoteErrors?: RemoteValidationErrors; submitting: boolean};

class SignupForm extends React.Component<SignupFormProps, SignupFormState> {
    pwdField1Ref = React.createRef<FormTextInput>();
    pwdField2Ref = React.createRef<FormTextInput>();
    setFieldError?: (field: string, message: string) => void;

    constructor(props: SignupFormProps) {
        super(props);
        this.state = {submitting: false};
    }

    submit(values: FormState) {
        this.setState({...this.state, submitting: true});
        (store.dispatch as MyThunkDispatch)(requestRegister(values.email, values.password)).then(
            ({success, errors}: ValidatedActionReturn) => {
                this.setState({remoteErrors: errors, submitting: false});
                if (errors && errors.fields) {
                    const f = errors.fields;
                    Object.keys(f).forEach((e) => this.setFieldError && this.setFieldError(e, localizeError(f[e])));
                }
                if (success && this.props.onSuccessfulSubmit) this.props.onSuccessfulSubmit(values);
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
                <Text style={styles.title}>{i18n.t("signupWelcome")}</Text>
                <Formik
                    initialValues={initialState()}
                    validationSchema={SignupFormSchema}
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
                        const textInputProps = {handleChange, handleBlur, ...getLoginTextInputsStyleProps(theme, 5)};
                        this.setFieldError = setFieldError;

                        return (
                            <>
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
                                    onSubmitEditing={() => this.pwdField1Ref.current?.focus()}
                                    {...textInputProps}
                                    icon={(focused) => (
                                        <MaterialIcons
                                            name="email"
                                            style={[
                                                fstyles.inputFieldIcon,
                                                focused ? fstyles.inputFieldIconFocused : {},
                                            ]}
                                        />
                                    )}
                                />

                                <FormTextInput
                                    ref={this.pwdField1Ref}
                                    field="password"
                                    placeholder={i18n.t("password")}
                                    accessibilityLabel={i18n.t("password")}
                                    error={errors.password}
                                    value={values.password}
                                    touched={touched.password}
                                    isPassword={true}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => this.pwdField2Ref.current?.focus()}
                                    {...textInputProps}
                                    icon={(focused) => (
                                        <MaterialIcons
                                            name="lock"
                                            style={[
                                                fstyles.inputFieldIcon,
                                                focused ? fstyles.inputFieldIconFocused : {},
                                            ]}
                                        />
                                    )}
                                />

                                {/* TEMP This is a workaround for a bug on some iOS versions.
                                    See https://github.com/facebook/react-native/issues/21572 */}
                                <TextInput style={{width: 1, height: 1}} />

                                <FormTextInput
                                    ref={this.pwdField2Ref}
                                    field="passwordRepeat"
                                    placeholder={i18n.t("passwordRepeat")}
                                    accessibilityLabel={i18n.t("passwordRepeat")}
                                    error={errors.passwordRepeat}
                                    value={values.passwordRepeat}
                                    touched={touched.passwordRepeat}
                                    isPassword={true}
                                    returnKeyType="done"
                                    {...textInputProps}
                                    icon={(focused) => (
                                        <MaterialIcons
                                            name="lock"
                                            style={[
                                                fstyles.inputFieldIcon,
                                                focused ? fstyles.inputFieldIconFocused : {},
                                            ]}
                                        />
                                    )}
                                />

                                <FormError error={generalError(remoteErrors)} />

                                <View style={styles.actionsContainer}>
                                    <FormSubmitButton
                                        onPress={() => {
                                            Keyboard.dismiss();
                                            handleSubmit();
                                        }}
                                        skin="rounded-filled"
                                        text={i18n.t("createAccount")}
                                        submitting={submitting}
                                    />
                                    <Button
                                        onPress={() => {
                                            Keyboard.dismiss();
                                            navigateBack();
                                        }}
                                        skin="rounded-hollow"
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
            flexDirection: "column",
            width: "100%",
            marginTop: 10,
        },
        title: {
            fontSize: 22,
            marginBottom: 5,
            color: theme.text,
        },
    });
});

export default withTheme(SignupForm);
