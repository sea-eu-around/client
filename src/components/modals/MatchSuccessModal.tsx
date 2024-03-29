import * as React from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import {withTheme} from "react-native-elements";
import {openChat, rootNavigate} from "../../navigation/utils";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import i18n from "i18n-js";
import {styleTextThin} from "../../styles/general";
import AsyncButton from "../AsyncButton";
import {UserProfile} from "../../model/user-profile";
import ProfileAvatar from "../ProfileAvatar";
import {OfferValueDto} from "../../api/dto";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import Button from "../Button";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import CustomModal, {CustomModalClass} from "./CustomModal";
import {getMatchingOffers} from "../../model/utils";
import Wave from "../Wave";
import themes from "../../constants/themes";

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

type MatchSuccessModalState = {
    profile: UserProfile | null;
    roomId: string | null;
    maxOffersDisplayed: number;
    waveWidth: number;
};

const VERTICAL_SPACE_AROUND = 0;
const MAX_WIDTH = 500;

const OFFERS_CARD_VERTICAL_PADDING = 10;
const OFFERS_CARD_LINE_HEIGHT = 20;

export class MatchSuccessModalClass extends React.Component<MatchSuccessModalProps, MatchSuccessModalState> {
    private modalRef = React.createRef<CustomModalClass>();

    constructor(props: MatchSuccessModalProps) {
        super(props);
        this.state = {profile: null, roomId: null, maxOffersDisplayed: 999, waveWidth: 0};
    }

    show(profile: UserProfile, roomId: string | null): void {
        this.modalRef.current?.show();

        this.setState({...this.state, profile, roomId, maxOffersDisplayed: 999});
    }

    hide(): void {
        this.setState({...this.state, profile: null});
        this.modalRef.current?.hide();
    }

    async chat(): Promise<void> {
        const {roomId} = this.state;
        this.hide();
        if (roomId) openChat(roomId);
        else rootNavigate("MainScreen", {screen: "TabMessaging"});
    }

    render(): JSX.Element {
        const {theme, localProfile} = this.props;
        const styles = themedStyles(theme);

        const {profile, maxOffersDisplayed, waveWidth} = this.state;
        const profileOffers =
            localProfile && profile && profile.profileOffers
                ? getMatchingOffers(profile.profileOffers, localProfile)
                : [];

        // Kept for quick testing
        /*const profileOffers =
            localProfile && profile && profile.profileOffers
                ? getMatchingOffers(
                      [
                          {
                              offerId: "provide-a-couch",
                              allowMale: true,
                              allowFemale: true,
                              allowOther: true,
                              allowStaff: true,
                              allowStudent: true,
                          },
                          {
                              offerId: "grab-a-drink",
                              allowMale: true,
                              allowFemale: true,
                              allowOther: true,
                              allowStaff: true,
                              allowStudent: true,
                          },
                          {
                              offerId: "answer-academic-questions",
                              allowMale: true,
                              allowFemale: true,
                              allowOther: true,
                              allowStaff: true,
                              allowStudent: true,
                          },
                          {
                              offerId: "get-into-campus-life",
                              allowMale: true,
                              allowFemale: true,
                              allowOther: true,
                              allowStaff: true,
                              allowStudent: true,
                          },
                          {
                              offerId: "cowork-on-a-project",
                              allowMale: true,
                              allowFemale: true,
                              allowOther: true,
                              allowStaff: true,
                              allowStudent: true,
                          },
                          {
                              offerId: "share-interests",
                              allowMale: true,
                              allowFemale: true,
                              allowOther: true,
                              allowStaff: true,
                              allowStudent: true,
                          },
                          {
                              offerId: "language-tandem",
                              allowMale: true,
                              allowFemale: true,
                              allowOther: true,
                              allowStaff: true,
                              allowStudent: true,
                          },
                      ],
                      localProfile,
                  )
                : [];*/

        return (
            <CustomModal
                ref={this.modalRef}
                fullHeight
                noBackground
                backdropBlur
                backdropOpacity={0}
                animationType="fade"
                modalViewStyle={styles.modal}
                renderContent={() => (
                    <>
                        <Wave
                            color={theme.greenModalBackground}
                            style={{width: waveWidth}}
                            upsideDown
                            patternIndex={9}
                        />

                        <View
                            style={styles.container}
                            onLayout={(layout) => {
                                const {width} = layout.nativeEvent.layout;
                                this.setState({...this.state, waveWidth: width});
                            }}
                        >
                            <View style={styles.topContainer}>
                                <Text style={styles.title}>{i18n.t("matching.success.title")}</Text>
                                <View style={styles.separator} />
                            </View>

                            <View style={styles.profileInfoContainer}>
                                <ProfileAvatar
                                    profile={profile || undefined}
                                    size={150}
                                    rounded
                                    containerStyle={styles.avatarContainer}
                                />
                                <Text style={styles.name}>
                                    {profile?.firstName} {profile?.lastName}
                                </Text>

                                {profileOffers.length > 0 && (
                                    <View
                                        style={[styles.offersCard, maxOffersDisplayed === 999 ? {opacity: 0} : {}]}
                                        onLayout={(layout) => {
                                            const height = layout.nativeEvent.layout.height;
                                            const availableHeight = height - OFFERS_CARD_VERTICAL_PADDING * 2;
                                            let numItems = Math.floor(availableHeight / OFFERS_CARD_LINE_HEIGHT) - 1;
                                            if (numItems < profileOffers.length) numItems--; // leave space to show "n more"
                                            if (numItems >= 0 && numItems != maxOffersDisplayed)
                                                this.setState({...this.state, maxOffersDisplayed: numItems});
                                        }}
                                    >
                                        <Text style={styles.offerText}>{i18n.t("matching.success.offersTitle")}</Text>
                                        {profileOffers.slice(0, maxOffersDisplayed).map((o: OfferValueDto) => (
                                            <View key={`match-profile-offer-${o.offerId}`}>
                                                <Text numberOfLines={1} style={styles.offerText}>
                                                    - {i18n.t(`allOffers.${o.offerId}.name`)}
                                                </Text>
                                            </View>
                                        ))}
                                        {maxOffersDisplayed < profileOffers.length && (
                                            <Text style={styles.offerText}>
                                                {profileOffers.length - maxOffersDisplayed}{" "}
                                                {i18n.t("matching.success.offersMore")}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>

                            <View style={styles.actionsContainer}>
                                <AsyncButton
                                    text={i18n.t("matching.success.chat")}
                                    skin="rounded-filled"
                                    icon={<MaterialCommunityIcons name="chat" style={styles.actionIcon} />}
                                    style={styles.action}
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
                                    style={[styles.action, {backgroundColor: theme.actionNeutral}]}
                                    onPress={() => this.hide()}
                                />
                            </View>
                        </View>

                        <Wave color={theme.greenModalBackground} style={{width: waveWidth}} patternIndex={5} />
                    </>
                )}
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        modal: {
            paddingHorizontal: 0,
            paddingVertical: VERTICAL_SPACE_AROUND,
            width: "100%",
            height: "100%",
            maxWidth: MAX_WIDTH,
            justifyContent: "center",
        },
        container: {
            width: "100%",
            backgroundColor: theme.greenModalBackground,
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "hidden",
            flexShrink: 1,
            // Prevents it from looking a little bit small when there are no offers to show
            minHeight: Math.min(400, Dimensions.get("window").height * 0.7),
        },
        topContainer: {
            alignItems: "center",
            width: "100%",
        },
        profileInfoContainer: {
            alignItems: "center",
            flexShrink: 1,
        },
        actionsContainer: {
            flexDirection: "row",
            alignItems: "center",
            width: "85%",
            maxWidth: 400,
            marginTop: 10,
            marginBottom: 10,
        },
        title: {
            width: "100%",
            textAlign: "center",
            ...styleTextThin,
            fontSize: 26,
            color: themes.dark.text,
            letterSpacing: 1,
            textTransform: "uppercase",
        },
        separator: {
            marginTop: 10,
            marginBottom: 20,
            height: 1,
            width: "80%",
            backgroundColor: themes.dark.text,
            opacity: 0.4,
        },
        avatarContainer: {
            borderColor: themes.dark.text,
            borderWidth: 0.5,
        },
        name: {
            color: themes.dark.text,
            fontSize: 24,
            marginVertical: 5,
        },
        offersCard: {
            backgroundColor: "#0001",
            borderRadius: 20,
            paddingVertical: OFFERS_CARD_VERTICAL_PADDING,
            paddingHorizontal: 20,
            marginTop: 10,
            flexShrink: 1,
            overflow: "hidden",
        },
        offerText: {
            color: themes.dark.text,
            fontSize: 16,
            lineHeight: OFFERS_CARD_LINE_HEIGHT,
        },
        action: {
            flex: 1,
            marginHorizontal: 5,
        },
        actionIcon: {
            fontSize: 22,
            color: themes.dark.text,
            marginLeft: 10,
        },
    });
});

export default reduxConnector(withTheme(MatchSuccessModalClass));
