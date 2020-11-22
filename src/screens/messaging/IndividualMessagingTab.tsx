import * as React from "react";
import {ScrollView, View, StyleSheet, Alert, Text, RefreshControl} from "react-native";
import {AppState, MyThunkDispatch} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {UserProfile} from "../../model/user-profile";
import ProfileMessagingCard from "../../components/messaging/ProfileMessagingCard";
import i18n from "i18n-js";
import {fetchMyMatches} from "../../state/matching/actions";

const mapStateToProps = (state: AppState) => ({
    profiles: state.matching.myMatches,
    fetchingMatches: state.matching.fetchingMyMatches,
});
const reduxConnector = connect(mapStateToProps);

// TEMP fake profiles
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testProfiles: UserProfile[] = [
    {
        id: "SpGiGSsGDdGSpogjQgsfGhfSdDFPFhGdShD",
        type: "student",
        firstName: "John",
        lastName: "Doe",
        university: "univ-brest",
        degree: "bsc3",
        nationality: "FR",
        birthdate: new Date(),
        gender: "male",
        interests: ["netflix"],
        avatarUrl: "",
        languages: [
            {code: "fr", level: "native"},
            {code: "en", level: "c2"},
        ],
        educationFields: [],
        profileOffers: [],
    },
    {
        id: "FQSFDPSfpgsdsdfPIUJIjGSfgpQgqujpgodREjPGS",
        type: "student",
        firstName: "Matt",
        lastName: "Brooks",
        university: "univ-cadiz",
        degree: "m2",
        nationality: "FR",
        birthdate: new Date(),
        gender: "male",
        interests: ["netflix"],
        avatarUrl: "",
        languages: [
            {code: "es", level: "native"},
            {code: "en", level: "c1"},
            {code: "fr", level: "b2"},
        ],
        educationFields: [],
        profileOffers: [],
    },
    {
        id: "FDPSfpgssdfPIUJIjfgpQujpgodREjPGS",
        type: "student",
        firstName: "Jeff",
        lastName: "Dale",
        university: "univ-cadiz",
        degree: "m2",
        nationality: "FR",
        birthdate: new Date(),
        gender: "male",
        interests: ["netflix"],
        avatarUrl: "",
        languages: [
            {code: "es", level: "native"},
            {code: "en", level: "c1"},
            {code: "fr", level: "b2"},
        ],
        educationFields: [],
        profileOffers: [],
    },
    {
        id: "qdqsFDPSfpgssdfPIUJIjfgpQujpgodRdqEjPGS",
        type: "student",
        firstName: "Harry",
        lastName: "Dodd",
        university: "univ-cadiz",
        degree: "m2",
        nationality: "FR",
        birthdate: new Date(),
        gender: "male",
        interests: ["netflix"],
        avatarUrl: "",
        languages: [
            {code: "es", level: "native"},
            {code: "fr", level: "b2"},
        ],
        educationFields: [],
        profileOffers: [],
    },
];

type IndividualMessagingTabProps = ConnectedProps<typeof reduxConnector> & ThemeProps;

class IndividualMessagingTab extends React.Component<IndividualMessagingTabProps> {
    componentDidMount() {
        (this.props.dispatch as MyThunkDispatch)(fetchMyMatches());
    }

    render(): JSX.Element {
        const {theme, profiles, fetchingMatches, dispatch} = this.props;
        const styles = themedStyles(theme);

        //const profiles = testProfiles;
        //const profiles: UserProfile[] = [];

        return (
            <View style={styles.wrapper}>
                <ScrollView
                    style={styles.matchesContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={fetchingMatches}
                            onRefresh={() => (dispatch as MyThunkDispatch)(fetchMyMatches())}
                        />
                    }
                >
                    {profiles.map((p: UserProfile) => (
                        <ProfileMessagingCard
                            key={p.id}
                            profile={p}
                            onPress={() => {
                                Alert.alert("Chatting is not implemented yet", "", [{text: "OK"}]);
                            }}
                        />
                    ))}
                    {!fetchingMatches && profiles.length == 0 && (
                        <View style={styles.noMatchesContainer}>
                            <Text style={styles.noMatchesText}>{i18n.t("messaging.noMatches")}</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            flex: 1,
            paddingHorizontal: 0,
            paddingVertical: 20,
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: theme.background,
            //height: 250,
        },
        matchesContainer: {
            width: "100%",
            height: "100%",
        },
        noMatchesContainer: {
            width: "80%",
            alignSelf: "center",
            marginVertical: 40,
        },
        noMatchesText: {
            color: theme.text,
            letterSpacing: 0.5,
            fontSize: 18,
            lineHeight: 24,
            textAlign: "center",
        },
    });
});

export default reduxConnector(withTheme(IndividualMessagingTab));
