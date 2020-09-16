import * as React from "react";
import {KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";
import themes from "../../constants/themes";
import i18n from "i18n-js";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {FormTextInput} from "../FormTextInput";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {VALIDATOR_EMAIL} from "../../validators";
import {getLoginTextInputsStyleProps} from "../../styles/forms";
import {FullProfile} from "../../model/profile";
import {Avatar} from "react-native-elements";
import {EducationFieldSelect} from "../EducationFieldSelect";
import {ScrollView} from "react-native-gesture-handler";
import {LevelOfStudyControl} from "../LevelOfStudyControl";
import NationalitySelect from "../NationalitySelect";
import {CountryCode} from "../../model/country-codes";
import {RoleToggle} from "../RoleToggle";
import {Gender, Role, StaffRole} from "../../constants/profile-constants";
import {StaffRoleToggle} from "../StaffRoleToggle";
import {GenderToggle} from "../GenderToggle";
import BirthDatePicker from "../BirthDatePicker";

// Use Yup to create the validation schema
const EditProfileFormSchema = Yup.object().shape({
    email: VALIDATOR_EMAIL,
});

// Form submission handler
function submitForm({email}: ProfileFormFields) {
    console.log("Edit profile form submitted", email);
}

// Map props from the store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.theming.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
export type EditProfileFormProps = ConnectedProps<typeof reduxConnector> & {
    profile: FullProfile;
    onFieldChanged?: (fields: Partial<FullProfile>) => void;
};

// State
export type EditProfileFormState = {};
type ProfileFormFields = {
    email: string;
};

function FormFieldSpacer(): JSX.Element {
    return <View style={{height: 30}}></View>;
}

class EditProfileForm extends React.Component<EditProfileFormProps, EditProfileFormState> {
    constructor(props: EditProfileFormProps) {
        super(props);
        // TODO remove the temporary profile, instead commit the change to the store (async action)
        this.state = {} as EditProfileFormState;
    }

    render() {
        const {theme, profile} = this.props;

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
            buttonSend: {
                flex: 1,
                backgroundColor: theme.accent,
                marginLeft: 6,
            },
            topView: {
                backgroundColor: "#af645d",
                width: "160%",
                height: 250,
                borderBottomLeftRadius: 200,
                borderBottomRightRadius: 200,
                paddingVertical: 50,
                alignItems: "center",
                alignSelf: "center",
            },
            scrollWrapper: {
                width: "100%",
            },
            formWrapper: {
                flex: 1,
                width: "80%",
                maxWidth: 600,
                flexDirection: "column",
                alignItems: "center",
                alignSelf: "center",
                paddingTop: 40,
                marginBottom: 80,
                //backgroundColor: "red",
            },
            name: {
                fontSize: 30,
                color: theme.textInverted,
                marginTop: 10,
            },
            avatarAccessory: {
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#333",
                color: "white",
            },
        });

        const onFieldChanged = this.props.onFieldChanged || (() => {});

        // TODO display origin university

        return (
            <React.Fragment>
                <View style={[styles.topView, {backgroundColor: theme.accent}]}>
                    <Avatar
                        size={120}
                        rounded
                        title={(profile.firstName[0] + profile.lastName[0]).toUpperCase()}
                        onPress={() => console.log("Works!")}
                        activeOpacity={0.6}
                        containerStyle={{backgroundColor: theme.accentSecondary}}
                    >
                        <Avatar.Accessory
                            name="photo"
                            type="material"
                            size={35}
                            style={styles.avatarAccessory}
                        ></Avatar.Accessory>
                    </Avatar>
                    <Text style={styles.name}>{profile.firstName + " " + profile.lastName}</Text>
                </View>
                <ScrollView style={styles.scrollWrapper}>
                    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-100} style={styles.formWrapper}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.title}>{i18n.t("myProfile")}</Text>
                        </View>
                        <Formik
                            initialValues={{email: ""} as ProfileFormFields}
                            validationSchema={EditProfileFormSchema}
                            validateOnBlur={false}
                            onSubmit={submitForm}
                        >
                            {(formikCfg: FormikProps<ProfileFormFields>) => {
                                const {handleSubmit, values, errors, touched, handleChange, handleBlur} = formikCfg;
                                const textInputProps = {
                                    handleChange,
                                    handleBlur,
                                    ...getLoginTextInputsStyleProps(theme),
                                };

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
                                        <FormFieldSpacer />
                                        <BirthDatePicker
                                            date={profile.birthDate}
                                            onSelect={(birthDate: Date) => onFieldChanged({birthDate})}
                                        />
                                        <FormFieldSpacer />
                                        <NationalitySelect
                                            nationality={profile.nationality}
                                            onSelect={(countryCode: CountryCode) =>
                                                onFieldChanged({nationality: countryCode})
                                            }
                                        />
                                        <FormFieldSpacer />
                                        <GenderToggle
                                            gender={profile.gender}
                                            onSelect={(gender: Gender) => onFieldChanged({gender})}
                                        />
                                        <FormFieldSpacer />
                                        <RoleToggle
                                            role={profile.role}
                                            onSelect={(role: Role) => onFieldChanged({role})}
                                        />
                                        {profile.role == "staff" && (
                                            <StaffRoleToggle
                                                staffRole={profile.staffRole || null}
                                                onSelect={(staffRole: StaffRole) => onFieldChanged({staffRole})}
                                            />
                                        )}
                                        {profile.role == "student" && (
                                            <React.Fragment>
                                                <FormFieldSpacer />
                                                <LevelOfStudyControl
                                                    levelIndex={profile.levelOfStudy}
                                                    onUpdateIndex={(levelIndex: number) =>
                                                        onFieldChanged({levelOfStudy: levelIndex})
                                                    }
                                                />
                                            </React.Fragment>
                                        )}
                                        <FormFieldSpacer />
                                        <EducationFieldSelect></EducationFieldSelect>
                                        <FormFieldSpacer />
                                    </React.Fragment>
                                );
                            }}
                        </Formik>
                    </KeyboardAvoidingView>
                </ScrollView>
            </React.Fragment>
        );
    }
}

/*


<View style={formStyle.actionRow}>
    <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={i18n.t("send")}
        onPress={() => handleSubmit()}
        style={[formStyle.buttonMajor, styles.buttonSend]}
    >
        <Text style={formStyle.buttonMajorText}>{i18n.t("send")}</Text>
    </TouchableOpacity>
</View>
*/

export default reduxConnector(EditProfileForm);
