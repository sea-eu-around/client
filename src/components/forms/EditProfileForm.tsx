import * as React from "react";
import {ActivityIndicator, KeyboardAvoidingView, Text, View} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import EducationFieldPicker from "../EducationFieldPicker";
import {ScrollView, StyleSheet} from "react-native";
import DegreeToggle from "../DegreeToggle";
import {CountryCode} from "../../model/country-codes";
import RoleToggle from "../RoleToggle";
import {Degree, Gender, StaffRole} from "../../constants/profile-constants";
import StaffRoleToggle from "../StaffRoleToggle";
import {GenderToggle} from "../GenderToggle";
import BirthDatePicker from "../BirthDatePicker.native";
import AvatarEditButton from "../AvatarEditButton";
import FormRow from "./FormRow";
import {FormattedDate} from "../FormattedDate";
import NationalityPicker from "../NationalityPicker";
import FormattedNationality from "../FormattedNationality";
import {getUniversityFromEmail} from "../../model/utils";
import FormattedUniversity from "../FormattedUniversity";
import InterestsPicker from "../InterestsPicker";
import {initOfferValue, OfferCategory, OfferDto, OfferValueDto, SpokenLanguageDto} from "../../api/dto";
import {UserProfile} from "../../model/user-profile";
import {User} from "../../model/user";
import {VALIDATOR_ONBOARDING_LANGUAGES} from "../../validators";
import SpokenLanguagesInput from "../SpokenLanguagesInput";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {ImageInfo} from "expo-image-picker/build/ImagePicker.types";
import store from "../../state/store";
import {AppState, MyThunkDispatch} from "../../state/types";
import {setAvatar} from "../../state/profile/actions";
import EnlargeableAvatar from "../EnlargeableAvatar";
import OfferControl from "../OfferControl";
import {connect, ConnectedProps} from "react-redux";

// Component props
export type EditProfileFormProps = ThemeProps & {
    user: User | null;
    onChange?: (fields: Partial<UserProfile>) => void;
};

function FormFieldSpacer(): JSX.Element {
    return <View style={{height: 30}}></View>;
}

class EditProfileForm extends React.Component<EditProfileFormProps> {
    onFieldChanged(fields: Partial<UserProfile>): void {
        if (this.props.onChange !== undefined) this.props.onChange(fields);
    }

    render() {
        const {theme, user} = this.props;
        const styles = themedStyles(theme);

        const fullName = user && user.profile ? user.profile.firstName + " " + user.profile.lastName : "";

        /*const textInputStyleProps = {
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
        };*/

        let profileFieldComponents = <></>;

        if (user && user.profile) {
            const profile = user.profile;

            profileFieldComponents = (
                <>
                    <FormRow
                        label={i18n.t("emailAddress")}
                        initialValue={user.email}
                        display={<Text style={styles.cardText}>{user.email}</Text>}
                        /*
                        validator={VALIDATOR_EMAIL}
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
                        apply={(email: string) => onFieldChanged({email})}
                        */
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
                                onSelect={(birthdate: Date) => {
                                    this.onFieldChanged({birthdate});
                                    hide();
                                }}
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
                        label={i18n.t("profileType")}
                        initialValue={profile.type}
                        display={
                            <>
                                <RoleToggle
                                    role={profile.type}
                                    /*onSelect={(role: Role) => onFieldChanged({role})}*/
                                    disabled={true}
                                />
                                {profile.type == "staff" && (
                                    <StaffRoleToggle
                                        staffRole={profile.staffRole || null}
                                        onSelect={(staffRole: StaffRole) => this.onFieldChanged({staffRole})}
                                    />
                                )}
                                {profile.type == "student" && (
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
                        display={
                            <EducationFieldPicker
                                fields={profile.educationFields}
                                onChange={(educationFields: string[]) => this.onFieldChanged({educationFields})}
                            ></EducationFieldPicker>
                        }
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
                    <FormFieldSpacer />
                    <OfferCategoryRow
                        category={OfferCategory.Discover}
                        profileOffers={profile.profileOffers}
                        onApply={(profileOffers: OfferValueDto[]) => this.onFieldChanged({profileOffers})}
                    ></OfferCategoryRow>
                    <FormFieldSpacer />
                    <OfferCategoryRow
                        category={OfferCategory.Collaborate}
                        profileOffers={profile.profileOffers}
                        onApply={(profileOffers: OfferValueDto[]) => this.onFieldChanged({profileOffers})}
                    ></OfferCategoryRow>
                    <FormFieldSpacer />
                    <OfferCategoryRow
                        category={OfferCategory.Meet}
                        profileOffers={profile.profileOffers}
                        onApply={(profileOffers: OfferValueDto[]) => this.onFieldChanged({profileOffers})}
                    ></OfferCategoryRow>
                </>
            );
        }

        return (
            <View style={styles.screenWrapper}>
                <View style={styles.topView}>
                    <EnlargeableAvatar
                        profile={user?.profile}
                        size={140}
                        rounded
                        containerStyle={styles.avatarContainer}
                        activeOpacity={0.8}
                    >
                        {user && (
                            <AvatarEditButton
                                onPictureSelected={(imageInfo: ImageInfo) => {
                                    (store.dispatch as MyThunkDispatch)(setAvatar(imageInfo));
                                }}
                            />
                        )}
                    </EnlargeableAvatar>
                    <Text style={styles.name}>{fullName}</Text>
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

// Map props from the store
const reduxConnector = connect((state: AppState) => ({
    offers: state.profile.offers,
    offerIdToCategory: state.profile.offerIdToCategory,
}));

type OfferCategoryRowProps = {
    category: OfferCategory;
    profileOffers: OfferValueDto[];
    onApply: (offerValues: OfferValueDto[]) => void;
} & ConnectedProps<typeof reduxConnector>;

const OfferCategoryRow = reduxConnector(
    ({category, profileOffers, onApply, offers, offerIdToCategory}: OfferCategoryRowProps): JSX.Element => {
        let display: JSX.Element | JSX.Element[] = profileOffers
            .filter((o) => offerIdToCategory.get(o.offerId) == category)
            .map((value: OfferValueDto) => (
                <Text key={`profile-${value.offerId}-display`}>{i18n.t(`allOffers.${value.offerId}.name`)}</Text>
            ));

        if (display.length == 0) display = <Text>{i18n.t("profile.noOffersSelected")}</Text>;

        return (
            <FormRow
                label={i18n.t(`offerCategories.${category}`)}
                initialValue={profileOffers}
                display={<>{display}</>}
                renderInput={(
                    value: OfferValueDto[],
                    error: string | null,
                    onChange: (value: OfferValueDto[]) => void,
                ) => (
                    <>
                        {offers
                            .filter((o) => o.category == category)
                            .map((offer: OfferDto) => (
                                <OfferControl
                                    key={`profile-${offer.id}`}
                                    offer={offer}
                                    value={value.find((o) => o.offerId == offer.id) || initOfferValue(offer)}
                                    onChange={(offerVal: OfferValueDto) => {
                                        const updatedVal = value
                                            .filter((o) => o.offerId != offer.id)
                                            .concat([offerVal]);
                                        onChange(updatedVal);
                                    }}
                                    style={{marginVertical: 10}}
                                />
                            ))}
                    </>
                )}
                apply={(profileOffers: OfferValueDto[]) => onApply(profileOffers)}
            />
        );
    },
);

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
            /*width: "160%",
            borderBottomLeftRadius: 200,
            borderBottomRightRadius: 200,*/
            width: "100%",
            paddingTop: 10,
            paddingBottom: 20,
            alignItems: "center",
            alignSelf: "center",
            backgroundColor: theme.accent,
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
            marginTop: 15,
        },
        university: {
            fontSize: 14,
            color: theme.textWhite,
        },
        universityContainer: {
            marginVertical: 5,
        },
        avatarContainer: {
            borderColor: theme.cardBackground,
            borderWidth: 2,
            backgroundColor: theme.accentSecondary,
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
