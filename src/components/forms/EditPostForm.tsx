import * as React from "react";
import {Platform, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput, FormTextInputProps} from "./FormTextInput";
import {getFormCheckBoxStyleProps} from "../../styles/forms";
import {FormProps, Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import store from "../../state/store";
import {AppState, MyThunkDispatch, ValidatedActionReturn} from "../../state/types";
import FormSubmitButton from "./FormSubmitButton";
import FormError from "./FormError";
import {generalError, localizeError} from "../../api/errors";
import {CreateGroupPostDto, RemoteValidationErrors} from "../../api/dto";
import {createGroupPost, updateGroupPost} from "../../state/groups/actions";
import {VALIDATOR_POST_TEXT} from "../../validators";
import {GroupPost} from "../../model/groups";
import ProfileAvatar from "../ProfileAvatar";
import {connect, ConnectedProps} from "react-redux";

const reduxConnector = connect((state: AppState) => ({
    localUser: state.profile.user,
}));

type FormState = {text: string; visible: boolean};

// Use Yup to create the validation schema
const EditPostFormSchema = Yup.object().shape({
    text: VALIDATOR_POST_TEXT,
});

// Component props
type EditPostFormProps = FormProps<FormState> &
    ThemeProps &
    ConnectedProps<typeof reduxConnector> & {
        groupId: string;
        post?: GroupPost; // if not given a post, one will be created instead of editing
        containerStyle?: StyleProp<ViewStyle>;
        onCancel?: () => void;
    };

// Component state
type EditPostFormState = {remoteErrors?: RemoteValidationErrors; submitting: boolean};

class EditPostForm extends React.Component<EditPostFormProps, EditPostFormState> {
    setFieldError?: (field: string, message: string) => void;

    constructor(props: EditPostFormProps) {
        super(props);
        this.state = {submitting: false};
    }

    private getCreationDto(values: FormState): CreateGroupPostDto {
        const {text} = values;
        return {type: "simple", text};
    }

    private initialState(): FormState {
        const {post} = this.props;
        if (post) {
            return {text: post.text, visible: false};
        } else {
            return {text: "", visible: false};
        }
    }

    submit(values: FormState) {
        const {groupId, post, onSuccessfulSubmit} = this.props;
        const dispatch = store.dispatch as MyThunkDispatch;

        this.setState({...this.state, submitting: true});

        const dto = this.getCreationDto(values);

        dispatch(post === undefined ? createGroupPost(groupId, dto) : updateGroupPost(groupId, post.id, dto)).then(
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
        const {theme, post, containerStyle, onCancel, localUser} = this.props;
        const {remoteErrors, submitting} = this.state;
        const styles = themedStyles(theme);

        const createMode = post === undefined;
        const poster = post ? post.creator : localUser?.profile;

        // TODO clean-up

        return (
            <View style={containerStyle}>
                <View style={styles.top}>
                    <ProfileAvatar profile={poster} rounded size={42} containerStyle={styles.creatorAvatar} />
                    <Text style={styles.creatorName}>
                        {poster?.firstName} {poster?.lastName}
                    </Text>
                </View>
                <View style={styles.formContent}>
                    <Formik
                        initialValues={this.initialState()}
                        validationSchema={EditPostFormSchema}
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
                            const textInputProps: Partial<FormTextInputProps> = {
                                handleChange,
                                handleBlur,
                                wrapperStyle: {flex: 1},
                                style: {flex: 1},
                                inputStyle: {
                                    fontSize: 20,
                                    paddingVertical: 10,
                                    color: theme.text,
                                    textAlignVertical: "top",
                                },
                                errorTextStyle: {textAlign: "center", marginBottom: 0},
                                inputFocusedStyle: Platform.OS === "web" ? ({outline: "none"} as TextStyle) : {},
                                placeholderTextColor: theme.inputPlaceholder,
                            };
                            const checkboxProps = {setFieldValue, setFieldTouched, ...getFormCheckBoxStyleProps(theme)};
                            this.setFieldError = setFieldError;

                            return (
                                <>
                                    <FormTextInput
                                        field="text"
                                        placeholder={i18n.t("groups.editPost.contentPlaceholder")}
                                        error={errors.text}
                                        value={values.text}
                                        touched={touched.text}
                                        multiline
                                        {...textInputProps}
                                    />

                                    {/*<FormCheckBox
                                        field="visible"
                                        error={errors.visible}
                                        value={values.visible}
                                        touched={touched.visible}
                                        label={i18n.t("groups.create.visible")}
                                        {...checkboxProps}
                                    />
                                    <Text style={styles.fieldDescription}>
                                        {i18n.t("groups.create.visibleDescription")}
                                    </Text>*/}

                                    <FormError error={generalError(remoteErrors)} />

                                    <View style={styles.actionsContainer}>
                                        {/*<Button
                                            onPress={() => {
                                                if (onCancel) onCancel();
                                            }}
                                            style={[styles.button, styles.buttonCancel]}
                                            skin="rounded-hollow"
                                            text={i18n.t("cancel")}
                                        />*/}

                                        <FormSubmitButton
                                            onPress={() => handleSubmit()}
                                            style={[styles.button, styles.buttonSubmit]}
                                            skin="rounded-filled"
                                            text={i18n.t(`groups.${createMode ? "newPost" : "editPost"}.submit`)}
                                            submitting={submitting}
                                        />
                                    </View>
                                </>
                            );
                        }}
                    </Formik>
                </View>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        top: {
            flexDirection: "row",
            alignItems: "center",
        },
        formContent: {
            flex: 1,
        },
        creatorAvatar: {
            marginRight: 10,
        },
        creatorName: {
            color: theme.text,
            fontSize: 18,
        },
        fieldDescription: {
            color: theme.textLight,
            fontSize: 14,
            marginBottom: 20,
        },
        actionsContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 5,
        },
        button: {flex: 1},
        buttonCancel: {marginRight: 10},
        buttonSubmit: {
            //marginLeft: 10,
        },
    });
});

export default reduxConnector(withTheme(EditPostForm));
