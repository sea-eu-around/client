import * as React from "react";
import {ActivityIndicator, Text, View, ScrollView} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import EducationFieldPicker from "../EducationFieldPicker";
import {StyleSheet} from "react-native";
import DegreeToggle from "../DegreeToggle";
import {CountryCode} from "../../model/country-codes";
import RoleToggle from "../RoleToggle";
import {Degree, Gender, StaffRole} from "../../constants/profile-constants";
import StaffRolePicker from "../StaffRolePicker";
import GenderToggle from "../GenderToggle";
import AvatarEditButton from "../AvatarEditButton";
import ValueCard from "../cards/ValueCard";
import {FormattedDate} from "../FormattedDate";
import NationalityPicker from "../NationalityPicker";
import FormattedNationality from "../FormattedNationality";
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
import WavyHeader from "../headers/WavyHeader";
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

        const profile = user?.profile;

        return (
            <ScrollView style={styles.rootScroll} contentContainerStyle={styles.scrollContent} overScrollMode="never">
                <WavyHeader style={styles.header} color={theme.accent}>
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
                    {profile && (
                        <FormattedUniversity
                            containerStyle={styles.universityContainer}
                            style={styles.university}
                            university={profile.university}
                        />
                    )}
                </WavyHeader>

                <View style={styles.body}>
                    <Text style={styles.title}>{i18n.t("myProfile")}</Text>
                    {!user && <ActivityIndicator size="large" style={styles.loadingIndicator} color={theme.accent} />}

                    <ValueCard
                        blank={!user}
                        label={i18n.t("emailAddress")}
                        initialValue={user?.email}
                        display={(user && <Text style={styles.cardText}>{user.email}</Text>) || undefined}
                        locked={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!user}
                        label={i18n.t("dateOfBirth")}
                        initialValue={profile?.birthdate}
                        display={profile && <FormattedDate style={styles.cardText} date={profile.birthdate} />}
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
                        blank={!user}
                        label={i18n.t("nationality")}
                        initialValue={profile?.nationality}
                        display={
                            profile && (
                                <FormattedNationality style={styles.cardText} countryCode={profile.nationality} />
                            )
                        }
                        overrideModal={
                            profile &&
                            ((hide: () => void) => (
                                <NationalityPicker
                                    nationality={profile.nationality}
                                    onSelect={(cc: CountryCode) => this.onFieldChanged({nationality: cc})}
                                    onHide={hide}
                                />
                            ))
                        }
                    />
                    <Spacer />
                    <ValueCard
                        blank={!user}
                        label={i18n.t("gender")}
                        initialValue={profile?.gender}
                        display={
                            profile && (
                                <GenderToggle
                                    gender={profile.gender}
                                    onSelect={(gender: Gender) => this.onFieldChanged({gender})}
                                />
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!user}
                        label={i18n.t("profileType")}
                        initialValue={profile?.type}
                        display={
                            profile && (
                                <>
                                    <RoleToggle role={profile.type} disabled={true} />
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
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!user}
                        label={i18n.t("fieldsOfEducation")}
                        initialValue={profile?.educationFields}
                        display={
                            <EducationFieldPicker
                                fields={profile?.educationFields}
                                onChange={(educationFields: string[]) => this.onFieldChanged({educationFields})}
                                showChips={true}
                            />
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!user}
                        label={i18n.t("interests")}
                        initialValue={profile?.interests}
                        display={
                            profile && (
                                <InterestsPicker
                                    interests={profile.interests}
                                    onChange={(interests: string[]) => this.onFieldChanged({interests})}
                                    showChips={true}
                                />
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!user}
                        label={i18n.t("spokenLanguages")}
                        initialValue={profile?.languages}
                        validator={VALIDATOR_ONBOARDING_LANGUAGES}
                        display={
                            profile && (
                                <Chips
                                    items={profile?.languages}
                                    label={(item: SpokenLanguageDto) =>
                                        `${i18n.t(`languageNames.${item.code}`)} (${i18n.t(
                                            `languageLevels.${item.level}`,
                                        )})`
                                    }
                                />
                            )
                        }
                        renderInput={(
                            value: SpokenLanguageDto[],
                            error: string | null,
                            onChange: (value: SpokenLanguageDto[]) => void,
                        ) => (
                            <SpokenLanguagesInput
                                languages={value}
                                onChange={(languages: SpokenLanguageDto[]) => onChange(languages)}
                                style={{width: "100%"}}
                            />
                        )}
                        apply={(languages: SpokenLanguageDto[]) => this.onFieldChanged({languages})}
                    />
                    <Spacer />
                    <OfferCategoryRow
                        category={OfferCategory.Discover}
                        profileOffers={profile?.profileOffers}
                        onApply={(profileOffers: OfferValueDto[]) => this.onFieldChanged({profileOffers})}
                        theme={theme}
                    />
                    <Spacer />
                    <OfferCategoryRow
                        category={OfferCategory.Collaborate}
                        profileOffers={profile?.profileOffers}
                        onApply={(profileOffers: OfferValueDto[]) => this.onFieldChanged({profileOffers})}
                        theme={theme}
                    />
                    <Spacer />
                    <OfferCategoryRow
                        category={OfferCategory.Meet}
                        profileOffers={profile?.profileOffers}
                        onApply={(profileOffers: OfferValueDto[]) => this.onFieldChanged({profileOffers})}
                        theme={theme}
                    />
                </View>
            </ScrollView>
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
    profileOffers: OfferValueDto[] | undefined;
    onApply: (offerValues: OfferValueDto[]) => void;
    theme: Theme;
} & ConnectedProps<typeof reduxConnector>;

const OfferCategoryRow = reduxConnector(
    ({category, profileOffers, onApply, offers, offerIdToCategory, theme}: OfferCategoryRowProps): JSX.Element => {
        const items = profileOffers?.filter((o) => offerIdToCategory.get(o.offerId) == category) || [];
        return (
            <ValueCard
                blank={!profileOffers}
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
                                    style={{marginVertical: 10, width: "100%"}}
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
        rootScroll: {
            width: "100%",
        },
        scrollContent: {
            width: "100%",
            alignItems: "center",
        },

        // Header-related styles
        header: {
            alignItems: "center",
            paddingBottom: 10,
        },
        name: {
            fontSize: 28,
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
        avatarContainer: {
            backgroundColor: theme.accentSecondary,
            borderColor: theme.cardBackground,
            borderWidth: 2,
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

        // Content-related style
        body: {
            width: "90%",
            maxWidth: 600,
            paddingTop: 90,
            paddingBottom: 50,
        },
        loadingIndicator: {
            position: "absolute",
            top: 70,
            left: 0,
            right: 0,
        },
        title: {
            fontSize: 22,
            color: theme.text,
            marginBottom: 20,
            width: "100%",
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
