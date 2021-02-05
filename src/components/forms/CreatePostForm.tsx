import * as React from "react";
import {StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "./FormTextInput";
import {getFormCheckBoxStyleProps, getLoginTextInputsStyleProps} from "../../styles/forms";
import {FormProps, Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import store from "../../state/store";
import {MyThunkDispatch, ValidatedActionReturn} from "../../state/types";
import FormSubmitButton from "./FormSubmitButton";
import FormError from "./FormError";
import {generalError, localizeError} from "../../api/errors";
import {CreatePostDto, RemoteValidationErrors} from "../../api/dto";
import {createGroupPost} from "../../state/groups/actions";
import Button from "../Button";
import {FormCheckBox} from "./FormCheckBox";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {VALIDATOR_POST_TEXT} from "../../validators";
import {Group} from "../../model/groups";

type FormState = {text: string; visible: boolean};

const initialState = (): FormState => ({text: "", visible: false});

// Use Yup to create the validation schema
const CreatePostFormSchema = Yup.object().shape({
    text: VALIDATOR_POST_TEXT,
});

// Component props
type CreatePostFormProps = FormProps<FormState> &
    ThemeProps & {group: Group; containerStyle?: StyleProp<ViewStyle>; onCancel?: () => void};

// Component state
type CreatePostFormState = {remoteErrors?: RemoteValidationErrors; submitting: boolean};

class CreatePostForm extends React.Component<CreatePostFormProps, CreatePostFormState> {
    setFieldError?: (field: string, message: string) => void;

    constructor(props: CreatePostFormProps) {
        super(props);
        this.state = {submitting: false};
    }

    private getCreationDto(values: FormState): CreatePostDto {
        const {text} = values;
        return {text};
    }

    submit(values: FormState) {
        const {group, onSuccessfulSubmit} = this.props;
        this.setState({...this.state, submitting: true});

        const dto = this.getCreationDto(values);

        (store.dispatch as MyThunkDispatch)(createGroupPost(group, dto)).then(
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
        const {theme, containerStyle, onCancel} = this.props;
        const {remoteErrors, submitting} = this.state;
        const styles = themedStyles(theme);

        return (
            <View style={containerStyle}>
                <View style={styles.titleWrapper}>
                    <MaterialCommunityIcons name="card-text" style={styles.titleIcon} />
                    <Text style={styles.title}>{i18n.t("groups.newPost.title")}</Text>
                </View>
                <Formik
                    initialValues={initialState()}
                    validationSchema={CreatePostFormSchema}
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
                            setFieldValue,
                            setFieldTouched,
                        } = formikProps;
                        const textInputProps = {handleChange, handleBlur, ...getLoginTextInputsStyleProps(theme, 15)};
                        const checkboxProps = {setFieldValue, setFieldTouched, ...getFormCheckBoxStyleProps(theme)};
                        this.setFieldError = setFieldError;

                        return (
                            <>
                                <FormTextInput
                                    field="text"
                                    placeholder={i18n.t("groups.newPost.contentPlaceholder")}
                                    error={errors.text}
                                    value={values.text}
                                    touched={touched.text}
                                    multiline
                                    style={[textInputProps.style, {height: 300}]}
                                    {...textInputProps}
                                />

                                <FormCheckBox
                                    field="visible"
                                    error={errors.visible}
                                    value={values.visible}
                                    touched={touched.visible}
                                    label={i18n.t("groups.create.visible")}
                                    {...checkboxProps}
                                />
                                <Text style={styles.fieldDescription}>
                                    {i18n.t("groups.create.visibleDescription")}
                                </Text>

                                <FormError error={generalError(remoteErrors)} />

                                <View style={styles.actionsContainer}>
                                    <Button
                                        onPress={() => {
                                            if (onCancel) onCancel();
                                        }}
                                        style={[styles.button, styles.buttonCancel]}
                                        skin="rounded-hollow"
                                        text={i18n.t("cancel")}
                                    />

                                    <FormSubmitButton
                                        onPress={() => handleSubmit()}
                                        style={[styles.button, styles.buttonSubmit]}
                                        skin="rounded-filled"
                                        text={i18n.t("groups.create.submit")}
                                        submitting={submitting}
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
        titleWrapper: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: 20,
        },
        titleIcon: {
            fontSize: 32,
            color: theme.textLight,
        },
        title: {
            fontSize: 22,
            color: theme.text,
            marginLeft: 10,
        },
        fieldDescription: {
            color: theme.textLight,
            fontSize: 14,
            marginBottom: 20,
        },
        actionsContainer: {
            width: "100%",
            flexDirection: "row",
            marginTop: 30,
        },
        button: {flex: 1},
        buttonCancel: {marginRight: 10},
        buttonSubmit: {marginLeft: 10},
    });
});

export default withTheme(CreatePostForm);
