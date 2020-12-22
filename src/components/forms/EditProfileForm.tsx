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
import StaffRolePicker from "../StaffRolePicker";
import GenderToggle from "../GenderToggle";
import AvatarEditButton from "../AvatarEditButton";
import ValueCard from "./ValueCard";
import {FormattedDate} from "../FormattedDate";
import NationalityPicker from "../NationalityPicker";
import FormattedNationality from "../FormattedNationality";
import {getUniversityFromEmail} from "../../model/utils";
import FormattedUniversity from "../FormattedUniversity";
import InterestsPicker from "../InterestsPicker";
import {initOfferValue, OfferCategory, OfferDto, OfferValueDto, SpokenLanguageDto} from "../../api/dto";
import {UserProfile, UserProfileStaff, UserProfileStudent} from "../../model/user-profile";
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
import Chips from "../Chips";
import BirthDateInput, {BirthDateInputClass} from "../BirthDateInput";

// Component props
export type EditProfileFormProps = ThemeProps & {
    user: User | null;
    onChange?: (fields: Partial<UserProfile>) => void;
};

function Spacer(): JSX.Element {
    return <View style={{height: 25}}></View>;
}

class EditProfileForm extends React.Component<EditProfileFormProps> {
    birthDateInputRef = React.createRef<BirthDateInputClass>();

    onFieldChanged(fields: Partial<UserProfile>): void {
        if (this.props.onChange !== undefined) this.props.onChange(fields);
    }

    render() {
        const {theme, user} = this.props;
        const styles = themedStyles(theme);

        const fullName = user && user.profile ? user.profile.firstName + " " + user.profile.lastName : "";

        let profileFieldComponents = <></>;

        if (user && user.profile) {
            const profile = user.profile;

            profileFieldComponents = (
                <>
                    <ValueCard
                        label={i18n.t("emailAddress")}
                        initialValue={user.email}
                        display={<Text style={styles.cardText}>{user.email}</Text>}
                        locked={true}
                    />
                    <Spacer />
                    <ValueCard
                        label={i18n.t("dateOfBirth")}
                        initialValue={profile.birthdate}
                        display={<FormattedDate style={styles.cardText} date={profile.birthdate} />}
                        renderInput={(value: Date, _error, onChange) => (
                            <BirthDateInput
                                ref={this.birthDateInputRef}
                                date={value}
                                containerStyle={styles.birthdateInputContainer}
                                inputStyle={styles.birthdateInput}
                                onChange={(birthdate?: Date, inputError?: string) => {
                                    onChange(birthdate || value, inputError || null);
                                }}
                            />
                        )}
                        onModalShown={() => this.birthDateInputRef.current?.focus()}
                        apply={(birthdate: Date) => this.onFieldChanged({birthdate})}
                    />
                    <Spacer />
                    <ValueCard
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
                    <Spacer />
                    <ValueCard
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
                    <Spacer />
                    <ValueCard
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
                                    <StaffRolePicker
                                        staffRoles={(profile as UserProfileStaff).staffRoles}
                                        onChange={(staffRoles: StaffRole[]) => this.onFieldChanged({staffRoles})}
                                        multiple={true}
                                        atLeastOne={true}
                                        buttonStyle={styles.staffRoleButton}
                                    />
                                )}
                                {profile.type == "student" && (
                                    <DegreeToggle
                                        degree={(profile as UserProfileStudent).degree}
                                        onUpdate={(degree?: Degree) => this.onFieldChanged({degree})}
                                    />
                                )}
                            </>
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        label={i18n.t("fieldsOfEducation")}
                        initialValue={profile.educationFields}
                        display={
                            <EducationFieldPicker
                                fields={profile.educationFields}
                                onChange={(educationFields: string[]) => this.onFieldChanged({educationFields})}
                                showChips={true}
                            />
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        label={i18n.t("interests")}
                        initialValue={profile.interests}
                        display={
                            <InterestsPicker
                                interests={profile.interests}
                                onChange={(interests: string[]) => this.onFieldChanged({interests})}
                                showChips={true}
                            />
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        label={i18n.t("spokenLanguages")}
                        initialValue={profile.languages}
                        validator={VALIDATOR_ONBOARDING_LANGUAGES}
                        display={
                            <Chips
                                items={profile.languages}
                                label={(item: SpokenLanguageDto) =>
                                    `${i18n.t(`languageNames.${item.code}`)} (${i18n.t(
                                        `languageLevels.${item.level}`,
                                    )})`
                                }
                            />
                        }
                        renderInput={(
                            value: SpokenLanguageDto[],
                            error: string | null,
                            onChange: (value: SpokenLanguageDto[]) => void,
                        ) => (
                            <SpokenLanguagesInput
                                languages={value}
                                onChange={(languages: SpokenLanguageDto[]) => onChange(languages)}
                            />
                        )}
                        apply={(languages: SpokenLanguageDto[]) => this.onFieldChanged({languages})}
                    />
                    <Spacer />
                    <OfferCategoryRow
                        category={OfferCategory.Discover}
                        profileOffers={profile.profileOffers}
                        onApply={(profileOffers: OfferValueDto[]) => this.onFieldChanged({profileOffers})}
                        theme={theme}
                    />
                    <Spacer />
                    <OfferCategoryRow
                        category={OfferCategory.Collaborate}
                        profileOffers={profile.profileOffers}
                        onApply={(profileOffers: OfferValueDto[]) => this.onFieldChanged({profileOffers})}
                        theme={theme}
                    />
                    <Spacer />
                    <OfferCategoryRow
                        category={OfferCategory.Meet}
                        profileOffers={profile.profileOffers}
                        onApply={(profileOffers: OfferValueDto[]) => this.onFieldChanged({profileOffers})}
                        theme={theme}
                    />
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
                <ScrollView style={styles.scrollWrapper} keyboardShouldPersistTaps="handled">
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
    theme: Theme;
} & ConnectedProps<typeof reduxConnector>;

const OfferCategoryRow = reduxConnector(
    ({category, profileOffers, onApply, offers, offerIdToCategory, theme}: OfferCategoryRowProps): JSX.Element => {
        const items = profileOffers.filter((o) => offerIdToCategory.get(o.offerId) == category);
        return (
            <ValueCard
                label={i18n.t(`offerCategories.${category}`)}
                initialValue={profileOffers}
                display={
                    items.length > 0 ? (
                        <Chips
                            items={items}
                            label={(item: OfferValueDto) => i18n.t(`allOffers.${item.offerId}.name`)}
                        />
                    ) : (
                        <Text style={{color: theme.textLight}}>{i18n.t("profile.noOffersSelected")}</Text>
                    )
                }
                renderInput={(value: OfferValueDto[], error, onChange) => (
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
            paddingBottom: 10,
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
        staffRoleButton: {
            marginTop: 10,
        },
        birthdateInputContainer: {
            marginTop: 20,
            marginBottom: 50,
        },
        birthdateInput: {
            height: 50,
            fontSize: 16,
            borderRadius: 10,
            backgroundColor: theme.cardBackground,
            color: theme.text,
        },
    });
});

export default withTheme(EditProfileForm);
