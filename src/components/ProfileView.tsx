import * as React from "react";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import {ScrollView} from "react-native";
import {FormattedDate} from "./FormattedDate";
import FormattedNationality from "./FormattedNationality";
import FormattedUniversity from "./FormattedUniversity";
import {UserProfile, UserProfileStaff, UserProfileStudent} from "../model/user-profile";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {StaffRole} from "../constants/profile-constants";
import ValueCard from "./cards/ValueCard";
import EnlargeableAvatar from "./EnlargeableAvatar";
import {OfferCategory, OfferValueDto, SpokenLanguageDto} from "../api/dto";
import FormattedGender from "./FormattedGender";
import Chips from "./Chips";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import WavyHeader from "./headers/WavyHeader";

// Component props
export type ProfileViewProps = ThemeProps & {
    profile: UserProfile | null;
    actionBar?: JSX.Element;
};

function Spacer(): JSX.Element {
    return <View style={{height: 25}}></View>;
}

class ProfileView extends React.Component<ProfileViewProps> {
    render() {
        const {theme, profile, actionBar} = this.props;
        const styles = themedStyles(theme);

        const fullName = profile ? profile.firstName + " " + profile.lastName : "";

        return (
            <ScrollView style={styles.rootScroll} contentContainerStyle={styles.scrollContent} overScrollMode="never">
                <WavyHeader style={styles.header} color={theme.accent}>
                    <EnlargeableAvatar
                        profile={profile || undefined}
                        size={120}
                        rounded
                        containerStyle={styles.avatarContainer}
                        activeOpacity={0.8}
                    />
                    {!profile && (
                        <ActivityIndicator size="large" color={theme.textWhite} style={styles.loadingIndicator} />
                    )}
                    <Text style={styles.name}>{fullName}</Text>
                    <FormattedUniversity
                        containerStyle={styles.universityContainer}
                        style={styles.university}
                        university={profile?.university || null}
                    />
                    {actionBar}
                </WavyHeader>

                <View style={styles.body}>
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("dateOfBirth")}
                        display={profile ? <FormattedDate style={styles.cardText} date={profile.birthdate} /> : <></>}
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("nationality")}
                        display={
                            profile ? (
                                <FormattedNationality style={styles.cardText} countryCode={profile.nationality} />
                            ) : (
                                <></>
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("gender")}
                        display={profile ? <FormattedGender style={styles.cardText} gender={profile.gender} /> : <></>}
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("profileType")}
                        display={
                            profile ? (
                                <>
                                    <Text style={styles.cardText}>{i18n.t(`allRoles.${profile.type}`)}</Text>
                                    {profile.type == "staff" && (
                                        <>
                                            {(profile as UserProfileStaff).staffRoles.map((sr: StaffRole) => (
                                                <Text key={`profile-staff-role-${sr}`}>
                                                    {i18n.t(`staffRoles.${sr}`)}
                                                </Text>
                                            ))}
                                        </>
                                    )}
                                    {profile.type == "student" && (
                                        <Text style={styles.cardText}>
                                            {i18n.t(`degrees.${(profile as UserProfileStudent).degree}`)}
                                        </Text>
                                    )}
                                </>
                            ) : (
                                <></>
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("fieldsOfEducation")}
                        display={
                            profile ? (
                                <Chips
                                    items={profile.educationFields}
                                    label={(item: string) => i18n.t(`educationFields.${item}`)}
                                />
                            ) : (
                                <></>
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("interests")}
                        display={
                            profile ? (
                                <Chips
                                    items={profile.interests}
                                    label={(item: string) => i18n.t(`interestNames.${item}`)}
                                />
                            ) : (
                                <></>
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("spokenLanguages")}
                        display={
                            profile ? (
                                <Chips
                                    items={profile.languages}
                                    label={(item: SpokenLanguageDto) =>
                                        `${i18n.t(`languageNames.${item.code}`)} (${i18n.t(
                                            `languageLevels.${item.level}`,
                                        )})`
                                    }
                                />
                            ) : (
                                <></>
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <OfferCategoryRow
                        category={OfferCategory.Discover}
                        profileOffers={profile?.profileOffers || null}
                    />
                    <Spacer />
                    <OfferCategoryRow
                        category={OfferCategory.Collaborate}
                        profileOffers={profile?.profileOffers || null}
                    />
                    <Spacer />
                    <OfferCategoryRow category={OfferCategory.Meet} profileOffers={profile?.profileOffers || null} />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("dateOfBirth")}
                        display={profile ? <FormattedDate style={styles.cardText} date={profile.birthdate} /> : <></>}
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("nationality")}
                        display={
                            profile ? (
                                <FormattedNationality style={styles.cardText} countryCode={profile.nationality} />
                            ) : (
                                <></>
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("gender")}
                        display={profile ? <FormattedGender style={styles.cardText} gender={profile.gender} /> : <></>}
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("profileType")}
                        display={
                            profile ? (
                                <>
                                    <Text style={styles.cardText}>{i18n.t(`allRoles.${profile.type}`)}</Text>
                                    {profile.type == "staff" && (
                                        <>
                                            {(profile as UserProfileStaff).staffRoles.map((sr: StaffRole) => (
                                                <Text key={`profile-staff-role-${sr}`}>
                                                    {i18n.t(`staffRoles.${sr}`)}
                                                </Text>
                                            ))}
                                        </>
                                    )}
                                    {profile.type == "student" && (
                                        <Text style={styles.cardText}>
                                            {i18n.t(`degrees.${(profile as UserProfileStudent).degree}`)}
                                        </Text>
                                    )}
                                </>
                            ) : (
                                <></>
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("fieldsOfEducation")}
                        display={
                            profile ? (
                                <Chips
                                    items={profile.educationFields}
                                    label={(item: string) => i18n.t(`educationFields.${item}`)}
                                />
                            ) : (
                                <></>
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("interests")}
                        display={
                            profile ? (
                                <Chips
                                    items={profile.interests}
                                    label={(item: string) => i18n.t(`interestNames.${item}`)}
                                />
                            ) : (
                                <></>
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <ValueCard
                        blank={!profile}
                        label={i18n.t("spokenLanguages")}
                        display={
                            profile ? (
                                <Chips
                                    items={profile.languages}
                                    label={(item: SpokenLanguageDto) =>
                                        `${i18n.t(`languageNames.${item.code}`)} (${i18n.t(
                                            `languageLevels.${item.level}`,
                                        )})`
                                    }
                                />
                            ) : (
                                <></>
                            )
                        }
                        noModal={true}
                    />
                    <Spacer />
                    <OfferCategoryRow
                        category={OfferCategory.Discover}
                        profileOffers={profile?.profileOffers || null}
                    />
                    <Spacer />
                    <OfferCategoryRow
                        category={OfferCategory.Collaborate}
                        profileOffers={profile?.profileOffers || null}
                    />
                    <Spacer />
                    <OfferCategoryRow category={OfferCategory.Meet} profileOffers={profile?.profileOffers || null} />
                </View>
            </ScrollView>
        );
    }
}

// Map props from the store
const reduxConnector = connect((state: AppState) => ({
    offerIdToCategory: state.profile.offerIdToCategory,
}));

type OfferCategoryRowProps = {
    category: OfferCategory;
    profileOffers: OfferValueDto[] | null;
} & ConnectedProps<typeof reduxConnector> &
    ThemeProps;

const OfferCategoryRow = reduxConnector(
    withTheme(
        ({category, profileOffers, offerIdToCategory, theme}: OfferCategoryRowProps): JSX.Element => {
            const items = profileOffers?.filter((o) => offerIdToCategory.get(o.offerId) == category) || [];
            const styles = themedStyles(theme);

            return (
                <ValueCard
                    blank={!profileOffers}
                    label={i18n.t(`offerCategories.${category}`)}
                    display={
                        items.length > 0 ? (
                            <Chips
                                items={items}
                                label={(item: OfferValueDto) => i18n.t(`allOffers.${item.offerId}.name`)}
                            />
                        ) : (
                            <Text style={styles.cardText}>{i18n.t("profile.noOffersSelected")}</Text>
                        )
                    }
                    noModal={true}
                />
            );
        },
    ),
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
        header: {
            alignItems: "center",
        },
        // Content-related style
        body: {
            width: "90%",
            maxWidth: 600,
            paddingTop: 90,
            paddingBottom: 50,
        },
        formWrapper: {
            width: "90%",
            maxWidth: 600,
            alignSelf: "center",
            paddingTop: 80,
            paddingBottom: 20,
        },
        loadingIndicator: {
            position: "absolute",
            left: 0,
            right: 0,
            top: 140,
        },
        name: {
            fontSize: 24,
            color: theme.textWhite,
            marginTop: 10,
            height: 30,
        },
        university: {
            fontSize: 14,
            color: theme.textWhite,
        },
        universityContainer: {
            height: 25,
            marginTop: 5,
        },
        avatarContainer: {
            borderColor: theme.textWhite,
            borderWidth: 1,
            backgroundColor: theme.accentSecondary,
        },
        cardText: {
            color: theme.text,
        },
    });
});

export default withTheme(ProfileView);
