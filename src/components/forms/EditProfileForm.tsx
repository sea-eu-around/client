import * as React from "react";
import {KeyboardAvoidingView, Platform, StyleSheet, Text, TextStyle, View} from "react-native";
import themes from "../../constants/themes";
import i18n from "i18n-js";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {VALIDATOR_EMAIL} from "../../validators";
import {FullProfile} from "../../model/profile";
import {Avatar} from "react-native-elements";
import EducationFieldPicker from "../EducationFieldPicker";
import {ScrollView} from "react-native";
import {LevelOfStudyControl} from "../LevelOfStudyControl";
import {CountryCode} from "../../model/country-codes";
import {RoleToggle} from "../RoleToggle";
import {Gender, Role, StaffRole} from "../../constants/profile-constants";
import {StaffRoleToggle} from "../StaffRoleToggle";
import {GenderToggle} from "../GenderToggle";
import BirthDatePicker from "../BirthDatePicker";
import AvatarEditButton from "../AvatarEditButton";
import FormRow from "./FormRow";
import {ValidatedTextInput} from "../ValidatedTextInput";
import {FormattedDate} from "../FormattedDate";
import NationalityPicker from "../NationalityPicker";
import {FormattedNationality} from "../FormattedNationality";
import {getUniversityFromEmail} from "../../model/utils";
import {FormattedUniversity} from "../FormattedUniversity";

// Map props from the store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
export type EditProfileFormProps = ConnectedProps<typeof reduxConnector> & {
    profile: FullProfile;
    onFieldChanged?: (fields: Partial<FullProfile>) => void;
};

// State
export type EditProfileFormState = {

};

function FormFieldSpacer(): JSX.Element {
    return <View style={{height: 30}}></View>;
}


class EditProfileForm extends React.Component<EditProfileFormProps, EditProfileFormState> {
    constructor(props: EditProfileFormProps) {
        super(props);
        this.state = {

        } as EditProfileFormState;
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
            screenWrapper: {
                backgroundColor: theme.background,
                width: "100%",
            },
            topView: {
                backgroundColor: "#af645d",
                width: "160%",
                height: 260,
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
                width: "90%",
                maxWidth: 600,
                flexDirection: "column",
                alignItems: "center",
                alignSelf: "center",
                paddingTop: 40,
                marginBottom: 300,
                //backgroundColor: "red",
            },
            name: {
                fontSize: 30,
                color: theme.textInverted,
                marginTop: 10,
            },
            university: {
                fontSize: 14,
                color: theme.textInverted,
                paddingLeft: 20,
            },
            universityContainer: {
                marginVertical: 5,
            },
            avatarAccessory: {
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 0,
                borderColor: "transparent",
                shadowRadius: 0,
                textShadowRadius: 0,
                color: "#444",
            },
        });

        const onFieldChanged = (fields: Partial<FullProfile>) => {
            if (this.props.onFieldChanged !== undefined) this.props.onFieldChanged(fields);
        };

        // TODO display origin university

        const textInputStyleProps = {
            placeholderTextColor: "#222",
            style: {
                width: "100%",
                height: 50,
                paddingHorizontal: 20,
                borderRadius: 5,
                borderWidth: 0,
                backgroundColor: theme.accentSlight,
            },
            errorStyle: {
                borderBottomWidth: 2,
                borderBottomColor: theme.error,
            },
            validStyle: {
                borderBottomWidth: 2,
                borderBottomColor: theme.okay,
            },
            focusedStyle: Platform.OS === "web" ? ({outlineColor: "transparent"} as TextStyle) : null,
        };

        return (
            <View style={styles.screenWrapper}>
                <View style={[styles.topView, {backgroundColor: theme.accent}]}>
                    <Avatar
                        size={120}
                        rounded
                        title={(profile.firstName[0] + profile.lastName[0]).toUpperCase()}
                        containerStyle={{backgroundColor: theme.accentSecondary}}
                        source={profile.avatarUri === "" ? undefined : {uri: profile.avatarUri}}
                    >
                        <AvatarEditButton
                            onPictureSelected={(avatarUri: string) => {
                                onFieldChanged({avatarUri});
                            }}
                        />
                    </Avatar>
                    <Text style={styles.name}>{profile.firstName + " " + profile.lastName}</Text>
                    <FormattedUniversity
                        containerStyle={styles.universityContainer}
                        style={styles.university}
                        university={getUniversityFromEmail(profile.email)}
                    ></FormattedUniversity>
                </View>
                <ScrollView style={styles.scrollWrapper} keyboardShouldPersistTaps="always">
                    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-100} style={styles.formWrapper}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.title}>{i18n.t("myProfile")}</Text>
                        </View>
                        <FormRow
                            label={i18n.t("emailAddress")}
                            initialValue={profile.email}
                            validator={VALIDATOR_EMAIL}
                            display={<Text>{profile.email}</Text>}
                            renderInput={(value: string, error: string | null, onChange: (value: string) => void) => (
                                <ValidatedTextInput
                                    placeholder={i18n.t("emailAddress")}
                                    value={value}
                                    error={error}
                                    onChangeText={(val) => onChange(val)}
                                    keyboardType="email-address"
                                    autoCompleteType="email"
                                    autoFocus
                                    {...textInputStyleProps}
                                />
                            )}
                            apply={(email: string) => onFieldChanged({email})}
                            locked={true}
                        />
                        <FormFieldSpacer />
                        <FormRow
                            label={i18n.t("dateOfBirth")}
                            initialValue={profile.birthDate}
                            display={<FormattedDate date={profile.birthDate} />}
                            overrideModal={(hide: () => void) => (
                                <BirthDatePicker
                                    date={profile.birthDate}
                                    open={true}
                                    onSelect={(birthDate: Date) => onFieldChanged({birthDate})}
                                    onHide={hide}
                                />
                            )}
                        />
                        <FormFieldSpacer />
                        <FormRow
                            label={i18n.t("nationality")}
                            initialValue={profile.nationality}
                            display={<FormattedNationality countryCode={profile.nationality} />}
                            overrideModal={(hide: () => void) => (
                                <NationalityPicker
                                    nationality={profile.nationality}
                                    onSelect={(countryCode: CountryCode) => onFieldChanged({nationality: countryCode})}
                                    onHide={hide}
                                />
                            )}
                        />
                        <FormFieldSpacer />
                        <FormRow
                            label={i18n.t("gender")}
                            initialValue={profile.gender}
                            display={
                                <GenderToggle
                                    gender={profile.gender}
                                    onSelect={(gender: Gender) => onFieldChanged({gender})}
                                />
                            }
                            noModal={true}
                        />
                        <FormFieldSpacer />
                        <FormRow
                            label={i18n.t("role")}
                            initialValue={profile.role}
                            display={
                                <React.Fragment>
                                    <RoleToggle role={profile.role} onSelect={(role: Role) => onFieldChanged({role})} />
                                    {profile.role == "staff" && (
                                        <StaffRoleToggle
                                            staffRole={profile.staffRole || null}
                                            onSelect={(staffRole: StaffRole) => onFieldChanged({staffRole})}
                                        />
                                    )}
                                    {profile.role == "student" && (
                                        <LevelOfStudyControl
                                            levelIndex={profile.levelOfStudy}
                                            onUpdateIndex={(levelIndex: number) =>
                                                onFieldChanged({levelOfStudy: levelIndex})
                                            }
                                        />
                                    )}
                                </React.Fragment>
                            }
                            noModal={true}
                            style={{height: profile.role == "staff" ? 130 : 130}}
                        />
                        <FormFieldSpacer />
                        <FormRow
                            label={i18n.t("fieldsOfEducation")}
                            initialValue={profile.gender}
                            display={<EducationFieldPicker></EducationFieldPicker>}
                            noModal={true}
                            style={{height: 100}}
                        />
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        );
    }
}

export default reduxConnector(EditProfileForm);
