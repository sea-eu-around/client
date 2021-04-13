import * as React from "react";
import {StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput, FormTextInputProps} from "./FormTextInput";
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
import {MAX_POST_LENGTH, VALIDATOR_POST_TEXT} from "../../validators";
import {GroupPost} from "../../model/groups";
import ProfileAvatar from "../ProfileAvatar";
import {connect, ConnectedProps} from "react-redux";
import {noop} from "lodash";

const reduxConnector = connect(
    (state: AppState) => ({
        localUser: state.profile.user,
    }),
    null,
    null,
    {forwardRef: true},
);

type FormState = {text: string};

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
    };

// Component state
type EditPostFormState = {remoteErrors?: RemoteValidationErrors; submitting: boolean};

export class EditPostFormClass extends React.Component<EditPostFormProps, EditPostFormState> {
    setFieldError?: (field: string, message: string) => void;
    submitForm: () => void = noop;
    textInputRef = React.createRef<FormTextInput>();

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
        if (post) return {text: post.text};
        else return {text: ""};
    }

    private submit(values: FormState): void {
        const {groupId, post, onSuccessfulSubmit} = this.props;
        const dispatch = store.dispatch as MyThunkDispatch;

        this.setState({...this.state, submitting: true});

        const dto = this.getCreationDto(values);

        // Make the promise cancellable to avoid updates when the component has been unmounted
        dispatch(post === undefined ? createGroupPost(groupId, dto) : updateGroupPost(groupId, post.id, dto)).then(
            ({success, errors}: ValidatedActionReturn) => {
                this.setState({remoteErrors: errors, submitting: false});
                if (errors && errors.fields) {
                    const f = errors.fields;
                    Object.keys(f).forEach((e) => this.setFieldError && this.setFieldError(e, localizeError(f[e])));
                }
                if (success && onSuccessfulSubmit) onSuccessfulSubmit(values);
            },
        );
    }

    triggerSubmit(): void {
        this.textInputRef.current?.blur();
        this.submitForm();
    }

    render(): JSX.Element {
        const {theme, post, containerStyle, localUser} = this.props;
        const {remoteErrors, submitting} = this.state;
        const styles = themedStyles(theme);

        const createMode = post === undefined;
        const poster = post ? post.creator : localUser?.profile;

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
                        validateOnChange
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
                                placeholderTextColor: theme.inputPlaceholder,
                            };
                            this.setFieldError = setFieldError;
                            this.submitForm = formikProps.submitForm;

                            return (
                                <>
                                    <Text
                                        style={[
                                            styles.lengthText,
                                            values.text.length > MAX_POST_LENGTH ? styles.lengthTextError : {},
                                        ]}
                                    >
                                        {values.text.length}/{MAX_POST_LENGTH}
                                    </Text>

                                    <FormTextInput
                                        ref={this.textInputRef}
                                        field="text"
                                        placeholder={i18n.t("groups.editPost.contentPlaceholder")}
                                        error={errors.text}
                                        value={values.text}
                                        touched={touched.text}
                                        multiline
                                        {...textInputProps}
                                    />

                                    <FormError error={generalError(remoteErrors)} />

                                    <View style={styles.actionsContainer}>
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
        lengthText: {
            fontSize: 14,
            color: theme.textLight,
            marginTop: 10,
        },
        lengthTextError: {
            color: theme.error,
        },
        actionsContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
        },
        button: {
            flex: 1,
            maxWidth: 300,
        },
        buttonSubmit: {},
    });
});

export default reduxConnector(withTheme(EditPostFormClass));
