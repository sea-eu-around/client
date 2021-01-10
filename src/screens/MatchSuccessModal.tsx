import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {withTheme} from "react-native-elements";
import {openChat, rootNavigate} from "../navigation/utils";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";
import {styleTextThin} from "../styles/general";
import AsyncButton from "../components/AsyncButton";
import {UserProfile} from "../model/user-profile";
import ProfileAvatar from "../components/ProfileAvatar";
import WavyHeader from "../components/headers/WavyHeader";
import {OfferValueDto} from "../api/dto";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import Button from "../components/Button";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import CustomModal, {CustomModalClass} from "../components/modals/CustomModal";

// Map props from store
const reduxConnector = connect(
    (state: AppState) => ({
        localProfile: state.profile.user?.profile,
    }),
    null,
    null,
    {forwardRef: true},
);

// Component props
export type MatchSuccessModalProps = ThemeProps & ConnectedProps<typeof reduxConnector>;

type MatchSuccessModalState = {profile: UserProfile | null};

const VERTICAL_SPACE_AROUND = 120;

export class MatchSuccessModalClass extends React.Component<MatchSuccessModalProps, MatchSuccessModalState> {
    private modalRef = React.createRef<CustomModalClass>();

    constructor(props: MatchSuccessModalProps) {
        super(props);
        this.state = {profile: null};
    }

    show(profile: UserProfile): void {
        this.modalRef.current?.show();
        this.setState({...this.state, profile});
    }

    hide(): void {
        this.modalRef.current?.hide();
        this.setState({...this.state, profile: null});
    }

    getRoomId(): string | null {
        /*const params = this.props.route.params;
        if (params) {
            const {roomId} = params as {[key: string]: unknown};
            if (roomId) return roomId as string;
        }*/
        return null;
    }

    getProfile(): UserProfile | null {
        return JSON.parse(
            '{"id":"58219076-60da-4616-ad1c-0ae76da6ff85","type":"staff","firstName":"Name","lastName":"Rippin","gender":"female","nationality":"PL","languages":[{"code":"pl","level":"native"},{"code":"ne","level":"b1"},{"code":"he","level":"c2"}],"profileOffers":[{"offerId":"provide-a-couch","allowMale":false,"allowFemale":true,"allowOther":false,"allowStaff":false,"allowStudent":true},{"offerId":"grab-a-drink","allowMale":true,"allowFemale":true,"allowOther":true,"allowStaff":false,"allowStudent":true},{"offerId":"answer-academic-questions","allowMale":true,"allowFemale":true,"allowOther":true,"allowStaff":true,"allowStudent":true}],"avatar":null,"score":0,"avatarUrl":null,"birthdate":"1993-09-18T02:59:24.853Z","educationFields":[],"interests":["fishing","soccer","cycling","surfing","tango","board-games"],"university":{"key":"univ-gdansk","country":"PL"},"staffRoles":[]}',
        );
        /*
        const params = this.props.route.params;
        if (params) {
            const {profile} = params as {[key: string]: unknown};
            if (profile) return unserializeProfile(profile as SerializedProfile);
        }*/
        return null;
    }

    async chat(): Promise<void> {
        const roomId = this.getRoomId();
        if (roomId) openChat(roomId);
        else rootNavigate("MainScreen", {screen: "TabMessaging"});
    }

    render(): JSX.Element {
        const {theme, localProfile} = this.props;
        const styles = themedStyles(theme);

        const profile = this.state.profile;
        const profileOffers =
            localProfile && profile && profile.profileOffers
                ? getMatchingOffers(profile.profileOffers, localProfile)
                : [];

        return (
            <CustomModal
                ref={this.modalRef}
                fullWidth
                fullHeight
                noBackground
                backdropBlur
                backdropOpacity={0}
                animationType="fade"
                modalViewStyle={{paddingHorizontal: 0, paddingVertical: 0}}
                renderContent={() => (
                    <>
                        <WavyHeader
                            color={theme.okay}
                            style={{marginTop: VERTICAL_SPACE_AROUND - 100}}
                            upsideDown
                            wavePatternIndex={9}
                        ></WavyHeader>
                        {/*<WavyHeader color={theme.okay} style={{alignItems: "center", justifyContent: "center"}}>
                        <Text style={styles.title}>{i18n.t("matching.success.title")}</Text>
                        <View style={styles.separator} />
                        <ProfileAvatar profile={profile || undefined} size={200} rounded avatarStyle={styles.avatar} />
                        <Text style={styles.name}>
                            {profile?.firstName} {profile?.lastName}
                        </Text>
                        <AsyncButton
                            text={i18n.t("matching.success.chat")}
                            textStyle={styles.actionText}
                            style={styles.actionButton}
                            onPress={async () => await this.chat()}
                        />
                        <TouchableOpacity
                            style={[styles.actionButton, {backgroundColor: theme.actionNeutral}]}
                            onPress={() => rootNavigate("TabMatchingScreen")}
                        >
                            <Text style={styles.actionText}>{i18n.t("matching.success.continue")}</Text>
                        </TouchableOpacity>
                    </WavyHeader>*/}
                        <View style={styles.container}>
                            <View style={styles.topContainer}>
                                <Text style={styles.title}>{i18n.t("matching.success.title")}</Text>
                                <View style={styles.separator} />
                            </View>

                            <View style={styles.profileInfoContainer}>
                                <ProfileAvatar
                                    profile={profile || undefined}
                                    size={150}
                                    rounded
                                    avatarStyle={styles.avatar}
                                />
                                <Text style={styles.name}>
                                    {profile?.firstName} {profile?.lastName}
                                </Text>

                                {profileOffers.length > 0 && (
                                    <View style={styles.offersCard}>
                                        <Text style={styles.offerText}>Open to:</Text>
                                        {profileOffers.map((o: OfferValueDto) => (
                                            <View key={`match-profile-offer-${o.offerId}`}>
                                                <Text style={styles.offerText}>
                                                    - {i18n.t(`allOffers.${o.offerId}.name`)}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <View style={styles.actionsContainer}>
                                <AsyncButton
                                    text={i18n.t("matching.success.chat")}
                                    skin="rounded-filled"
                                    //textStyle={styles.actionText}
                                    icon={<MaterialCommunityIcons name="chat" style={styles.actionIcon} />}
                                    //style={styles.actionButton}
                                    onPress={async () => await this.chat()}
                                />
                                <Button
                                    text={i18n.t("matching.success.continue")}
                                    icon={
                                        <MaterialCommunityIcons
                                            name="gesture-swipe-vertical"
                                            style={styles.actionIcon}
                                        />
                                    }
                                    skin="rounded-filled"
                                    style={[{backgroundColor: theme.actionNeutral}]}
                                    onPress={() => /*rootNavigate("TabMatchingScreen")*/ this.hide()}
                                />
                            </View>
                        </View>
                        {/*<WavyHeader color={theme.okay} style={{height: 0, transform: [{rotate: "0deg"}]}}></WavyHeader>*/}
                        <WavyHeader
                            color={theme.okay}
                            style={{position: "absolute", bottom: VERTICAL_SPACE_AROUND}}
                            wavePatternIndex={5}
                        ></WavyHeader>
                    </>
                )}
            />
        );
    }
}

function getMatchingOffers(offers: OfferValueDto[], profile: UserProfile): OfferValueDto[] {
    return offers.filter((o: OfferValueDto) => {
        if (
            (!o.allowFemale && profile.gender === "female") ||
            (!o.allowMale && profile.gender === "male") ||
            (!o.allowOther && profile.gender === "other") ||
            (!o.allowStaff && profile.type === "staff") ||
            (!o.allowStudent && profile.type === "student")
        )
            return false;
        return true;
    });
}

/*
<View style={styles.container}>
    <Text style={styles.title}>{i18n.t("matching.success.title")}</Text>
    <View style={styles.separator} />
    <ProfileAvatar profile={profile || undefined} size={200} rounded avatarStyle={styles.avatar} />
    <Text style={styles.name}>
        {profile?.firstName} {profile?.lastName}
    </Text>
    <AsyncButton
        text={i18n.t("matching.success.chat")}
        textStyle={styles.actionText}
        style={styles.actionButton}
        onPress={async () => await this.chat()}
    />
    <TouchableOpacity
        style={[styles.actionButton, {backgroundColor: theme.actionNeutral}]}
        onPress={() => rootNavigate("TabMatchingScreen")}
    >
        <Text style={styles.actionText}>{i18n.t("matching.success.continue")}</Text>
    </TouchableOpacity>
</View>
*/

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.okay,
            marginTop: 100,
            marginBottom: VERTICAL_SPACE_AROUND,
            //backgroundColor: "red",
        },
        topContainer: {
            alignItems: "center",
            width: "100%",
        },
        profileInfoContainer: {
            alignItems: "center",
        },
        actionsContainer: {
            alignItems: "center",
            width: "80%",
            maxWidth: 250,
        },
        title: {
            width: "100%",
            textAlign: "center",
            ...styleTextThin,
            fontSize: 28,
            color: theme.textWhite,
            letterSpacing: 1,
            textTransform: "uppercase",
        },
        separator: {
            marginTop: 10,
            marginBottom: 30,
            height: 1,
            width: "80%",
            backgroundColor: theme.cardBackground,
            opacity: 0.5,
        },
        avatar: {
            borderColor: theme.textWhite,
            borderWidth: 0.5,
        },
        name: {
            /*backgroundColor: "#0001",
            borderRadius: 20,
            paddingVertical: 5,
            paddingHorizontal: 20,*/

            color: theme.textWhite,
            fontSize: 22,
            marginTop: 5,
            marginBottom: 10,
        },
        offersCard: {
            backgroundColor: "#0001",
            borderRadius: 20,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginVertical: 10,
        },
        offerText: {
            color: theme.textWhite,
            fontSize: 16,
        },
        actionIcon: {
            fontSize: 22,
            color: theme.textWhite,
            marginLeft: 10,
        },
        actionButton: {
            backgroundColor: theme.accent,
            paddingHorizontal: 30,
            paddingVertical: 10,
            marginVertical: 10,
            borderRadius: 20,
        },
        actionText: {
            color: theme.textWhite,
            fontSize: 18,
            letterSpacing: 1,
            textTransform: "uppercase",
        },
    });
});

export default reduxConnector(withTheme(MatchSuccessModalClass));
