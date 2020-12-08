import * as React from "react";
import {ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import {ScrollView} from "react-native";
import {FormattedDate} from "./FormattedDate";
import FormattedNationality from "./FormattedNationality";
import FormattedUniversity from "./FormattedUniversity";
import {UserProfile, UserProfileStaff, UserProfileStudent} from "../model/user-profile";
import {PARTNER_UNIVERSITIES} from "../constants/universities";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {StaffRole} from "../constants/profile-constants";
import ValueCard from "./forms/ValueCard";
import EnlargeableAvatar from "./EnlargeableAvatar";
import {OfferCategory, OfferValueDto, SpokenLanguageDto} from "../api/dto";
import FormattedGender from "./FormattedGender";
import Chips from "./Chips";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";

// Component props
export type ProfileViewProps = ThemeProps & {
    profile: UserProfile | null;
};

function Spacer(): JSX.Element {
    return <View style={{height: 30}}></View>;
}

class ProfileView extends React.Component<ProfileViewProps> {
    render() {
        const {theme, profile} = this.props;
        const styles = themedStyles(theme);

        const fullName = profile ? profile.firstName + " " + profile.lastName : "";
        const university = profile ? PARTNER_UNIVERSITIES.find((u) => u.key === profile.university) : undefined;

        let profileFieldComponents = <></>;

        if (profile) {
            profileFieldComponents = (
                <>
                    <ValueCard
                        label={i18n.t("dateOfBirth")}
                        display={<FormattedDate style={styles.cardText} date={profile.birthdate} />}
                        noModal={true}
                        initialValue={undefined}
                    />
                    <Spacer />
                    <ValueCard
                        label={i18n.t("nationality")}
                        display={<FormattedNationality style={styles.cardText} countryCode={profile.nationality} />}
                        noModal={true}
                        initialValue={undefined}
                    />
                    <Spacer />
                    <ValueCard
                        label={i18n.t("gender")}
                        display={<FormattedGender gender={profile.gender} />}
                        noModal={true}
                        initialValue={undefined}
                    />
                    <Spacer />
                    <ValueCard
                        label={i18n.t("profileType")}
                        display={
                            <>
                                <Text>{i18n.t(`allRoles.${profile.type}`)}</Text>
                                {profile.type == "staff" && (
                                    <>
                                        {(profile as UserProfileStaff).staffRoles.map((sr: StaffRole) => (
                                            <Text key={`profile-staff-role-${sr}`}>{i18n.t(`staffRoles.${sr}`)}</Text>
                                        ))}
                                    </>
                                )}
                                {profile.type == "student" && (
                                    <Text>{i18n.t(`degrees.${(profile as UserProfileStudent).degree}`)}</Text>
                                )}
                            </>
                        }
                        noModal={true}
                        initialValue={undefined}
                    />
                    <Spacer />
                    <ValueCard
                        label={i18n.t("fieldsOfEducation")}
                        display={
                            <Chips
                                items={profile.educationFields}
                                label={(item: string) => i18n.t(`educationFields.${item}`)}
                            />
                        }
                        noModal={true}
                        initialValue={undefined}
                    />
                    <Spacer />
                    <ValueCard
                        label={i18n.t("interests")}
                        display={
                            <Chips
                                items={profile.interests}
                                label={(item: string) => i18n.t(`interestNames.${item}`)}
                            />
                        }
                        noModal={true}
                        initialValue={undefined}
                    />
                    <Spacer />
                    <ValueCard
                        label={i18n.t("spokenLanguages")}
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
                        noModal={true}
                        initialValue={undefined}
                    />
                    <Spacer />
                    <OfferCategoryRow category={OfferCategory.Discover} profileOffers={profile.profileOffers} />
                    <Spacer />
                    <OfferCategoryRow category={OfferCategory.Collaborate} profileOffers={profile.profileOffers} />
                    <Spacer />
                    <OfferCategoryRow category={OfferCategory.Meet} profileOffers={profile.profileOffers} />
                </>
            );
        }

        return (
            <View style={styles.screenWrapper}>
                <View style={styles.topView}>
                    <EnlargeableAvatar
                        profile={profile || undefined}
                        size={140}
                        rounded
                        containerStyle={styles.avatarContainer}
                        activeOpacity={0.8}
                    />
                    <Text style={styles.name}>{fullName}</Text>
                    {university && (
                        <FormattedUniversity
                            containerStyle={styles.universityContainer}
                            style={styles.university}
                            university={university}
                        />
                    )}
                </View>
                <ScrollView style={styles.scrollWrapper} keyboardShouldPersistTaps="always">
                    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-100} style={styles.formWrapper}>
                        {/*<View style={styles.titleWrapper}>
                            <Text style={styles.title}>{i18n.t("myProfile")}</Text>
                        </View>*/}
                        {profileFieldComponents}
                        {!profile && <ActivityIndicator size="large" color={theme.accent} />}
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        );
    }
}

// Map props from the store
const reduxConnector = connect((state: AppState) => ({
    offerIdToCategory: state.profile.offerIdToCategory,
}));

type OfferCategoryRowProps = {
    category: OfferCategory;
    profileOffers: OfferValueDto[];
} & ConnectedProps<typeof reduxConnector>;

const OfferCategoryRow = reduxConnector(
    ({category, profileOffers, offerIdToCategory}: OfferCategoryRowProps): JSX.Element => {
        const items = profileOffers.filter((o) => offerIdToCategory.get(o.offerId) == category);

        return (
            <ValueCard
                label={i18n.t(`offerCategories.${category}`)}
                display={
                    items.length > 0 ? (
                        <Chips
                            items={items}
                            label={(item: OfferValueDto) => i18n.t(`allOffers.${item.offerId}.name`)}
                        />
                    ) : (
                        <Text>{i18n.t("profile.noOffersSelected")}</Text>
                    )
                }
                noModal={true}
                initialValue={undefined}
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
    });
});

export default withTheme(ProfileView);
