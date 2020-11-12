import * as React from "react";
import {ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextStyle, View} from "react-native";
import i18n from "i18n-js";
import {Avatar, withTheme} from "react-native-elements";
import EducationFieldPicker from "../EducationFieldPicker";
import {ScrollView, StyleSheet} from "react-native";
import DegreeToggle from "../DegreeToggle";
import {CountryCode} from "../../model/country-codes";
import RoleToggle from "../RoleToggle";
import {Degree, Gender, StaffRole} from "../../constants/profile-constants";
import StaffRoleToggle from "../StaffRoleToggle";
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
import InterestsPicker from "../InterestsPicker";
import {SpokenLanguageDto, UserDto, UserProfileDto} from "../../api/dto";
import {VALIDATOR_ONBOARDING_LANGUAGES} from "../../validators";
import SpokenLanguagesInput from "../SpokenLanguagesInput";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";

// Component props
export type EditProfileFormProps = ThemeProps & {
    user: UserDto | null;
    onChange?: (fields: Partial<UserProfileDto>) => void;
};

function FormFieldSpacer(): JSX.Element {
    return <View style={{height: 30}}></View>;
}

class EditProfileForm extends React.Component<EditProfileFormProps> {
    onFieldChanged(fields: Partial<UserProfileDto>): void {
        if (this.props.onChange !== undefined) this.props.onChange(fields);
    }

    render() {
        const {theme, user} = this.props;
        const styles = themedStyles(theme);

        const avatarTitle = user ? (user.profile.firstName[0] + user.profile.lastName[0]).toUpperCase() : "";
        const avatarUri = user && user.profile.avatarUri ? {uri: user.profile.avatarUri} : undefined;

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

        let profileFieldComponents = <></>;

        if (user) {
            const profile = user.profile;
            profileFieldComponents = (
                <>
                    <FormRow
                        label={i18n.t("emailAddress")}
                        initialValue={user.email}
                        // validator={VALIDATOR_EMAIL}
                        display={<Text style={styles.cardText}>{user.email}</Text>}
                        renderInput={(value: string, error: string | null, onChange: (value: string) => void) => (
                            <ValidatedTextInput
                                placeholder={i18n.t("emailAddress")}
                                value={value}
                                error={error || undefined}
                                onChangeText={(val) => onChange(val)}
                                keyboardType="email-address"
                                autoCompleteType="email"
                                autoFocus
                                {...textInputStyleProps}
                            />
                        )}
                        //apply={(email: string) => onFieldChanged({email})}
                        locked={true}
                    />
                    <FormFieldSpacer />
                    <FormRow
                        label={i18n.t("dateOfBirth")}
                        initialValue={profile.birthdate}
                        display={<FormattedDate style={styles.cardText} date={profile.birthdate} />}
                        overrideModal={(hide: () => void) => (
                            <BirthDatePicker
                                date={profile.birthdate}
                                open={true}
                                onSelect={(birthdate: Date) => this.onFieldChanged({birthdate})}
                                onHide={hide}
                            />
                        )}
                    />
                    <FormFieldSpacer />
                    <FormRow
                        label={i18n.t("nationality")}
                        initialValue={profile.nationality}
                        display={<FormattedNationality style={styles.cardText} countryCode={profile.nationality} />}
                        overrideModal={(hide: () => void) => (
                            <NationalityPicker
                                nationality={profile.nationality}
                                onSelect={(cc: CountryCode) => this.onFieldChanged({nationality: cc})}
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
                                onSelect={(gender: Gender) => this.onFieldChanged({gender})}
                            />
                        }
                        noModal={true}
                    />
                    <FormFieldSpacer />
                    <FormRow
                        label={i18n.t("role")}
                        initialValue={user.role}
                        display={
                            <>
                                <RoleToggle
                                    role={user.role}
                                    /*onSelect={(role: Role) => onFieldChanged({role})}*/
                                    disabled={true}
                                />
                                {user.role == "staff" && (
                                    <StaffRoleToggle
                                        staffRole={profile.staffRole || null}
                                        onSelect={(staffRole: StaffRole) => this.onFieldChanged({staffRole})}
                                    />
                                )}
                                {user.role == "student" && (
                                    <DegreeToggle
                                        degree={profile.degree}
                                        onUpdate={(degree?: Degree) => this.onFieldChanged({degree})}
                                    />
                                )}
                            </>
                        }
                        noModal={true}
                    />
                    <FormFieldSpacer />
                    <FormRow
                        label={i18n.t("fieldsOfEducation")}
                        initialValue={profile.educationFields}
                        display={<EducationFieldPicker fields={profile.educationFields}></EducationFieldPicker>}
                        noModal={true}
                    />
                    <FormFieldSpacer />
                    <FormRow
                        label={i18n.t("interests")}
                        initialValue={profile.interests}
                        display={
                            <InterestsPicker
                                interests={profile.interests}
                                onChange={(interests: string[]) => this.onFieldChanged({interests})}
                            ></InterestsPicker>
                        }
                        noModal={true}
                    />
                    <FormFieldSpacer />
                    <FormRow
                        label={i18n.t("spokenLanguages")}
                        initialValue={profile.languages}
                        validator={VALIDATOR_ONBOARDING_LANGUAGES}
                        display={
                            <>
                                {profile.languages.map((l: SpokenLanguageDto, i: number) => (
                                    <View key={i}>
                                        <Text>
                                            {i18n.t(`languageNames.${l.code}`)} ({i18n.t(`languageLevels.${l.level}`)})
                                        </Text>
                                    </View>
                                ))}
                            </>
                        }
                        renderInput={(
                            value: SpokenLanguageDto[],
                            error: string | null,
                            onChange: (value: SpokenLanguageDto[]) => void,
                        ) => (
                            <>
                                <SpokenLanguagesInput
                                    languages={value}
                                    onChange={(languages: SpokenLanguageDto[]) => onChange(languages)}
                                />
                                <FormFieldSpacer />
                                <FormFieldSpacer />
                                <FormFieldSpacer />
                                <FormFieldSpacer />
                                <FormFieldSpacer />
                                <FormFieldSpacer />
                            </>
                        )}
                        apply={(languages: SpokenLanguageDto[]) => this.onFieldChanged({languages})}
                    />
                </>
            );
        }

        return (
            <View style={styles.screenWrapper}>
                <View style={[styles.topView, {backgroundColor: theme.accent}]}>
                    <Avatar
                        size={120}
                        rounded
                        title={avatarTitle}
                        containerStyle={{backgroundColor: theme.accentSecondary}}
                        source={avatarUri}
                    >
                        {user && (
                            <AvatarEditButton
                                onPictureSelected={(avatarUri: string) => {
                                    this.onFieldChanged({avatarUri});
                                }}
                            />
                        )}
                    </Avatar>
                    <Text style={styles.name}>{user ? user.profile.firstName + " " + user.profile.lastName : ""}</Text>
                    {user && (
                        <FormattedUniversity
                            containerStyle={styles.universityContainer}
                            style={styles.university}
                            university={getUniversityFromEmail(user.email)}
                        ></FormattedUniversity>
                    )}
                </View>
                <ScrollView style={styles.scrollWrapper} keyboardShouldPersistTaps="always">
                    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-100} style={styles.formWrapper}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.title}>{i18n.t("myProfile")}</Text>
                        </View>
                        {profileFieldComponents}
                        {!user && <ActivityIndicator size="large" color={theme.accent} />}
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
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
        },
        name: {
            fontSize: 30,
            color: theme.textWhite,
            marginTop: 10,
        },
        university: {
            fontSize: 14,
            color: theme.textWhite,
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
        cardText: {
            color: theme.text,
        },
    });
});

export default withTheme(EditProfileForm);
