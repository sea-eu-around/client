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
import {getMatchingOffers} from "../model/utils";

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

type MatchSuccessModalState = {profile: UserProfile | null; roomId: string | null};

const VERTICAL_SPACE_AROUND = 120;
const MAX_WIDTH = 500;

export class MatchSuccessModalClass extends React.Component<MatchSuccessModalProps, MatchSuccessModalState> {
    private modalRef = React.createRef<CustomModalClass>();

    constructor(props: MatchSuccessModalProps) {
        super(props);
        this.state = {profile: null, roomId: null};
    }

    show(profile: UserProfile, roomId: string | null): void {
        this.modalRef.current?.show();
        this.setState({...this.state, profile, roomId});
    }

    hide(): void {
        this.modalRef.current?.hide();
        this.setState({...this.state, profile: null});
    }

    async chat(): Promise<void> {
        const {roomId} = this.state;
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
                fullHeight
                noBackground
                backdropBlur
                backdropOpacity={0}
                animationType="fade"
                modalViewStyle={{paddingHorizontal: 0, paddingVertical: 0, width: "100%", maxWidth: MAX_WIDTH}}
                renderContent={() => (
                    <>
                        <WavyHeader
                            color={theme.greenModalBackground}
                            style={{marginTop: VERTICAL_SPACE_AROUND - 100}}
                            upsideDown
                            wavePatternIndex={9}
                        ></WavyHeader>

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
                                    containerStyle={styles.avatarContainer}
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
                                    icon={<MaterialCommunityIcons name="chat" style={styles.actionIcon} />}
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
                                    onPress={() => this.hide()}
                                />
                            </View>
                        </View>

                        <WavyHeader
                            color={theme.greenModalBackground}
                            style={{position: "absolute", bottom: VERTICAL_SPACE_AROUND}}
                            wavePatternIndex={5}
                        ></WavyHeader>
                    </>
                )}
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.greenModalBackground,
            marginTop: 100,
            marginBottom: VERTICAL_SPACE_AROUND,
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
        avatarContainer: {
            borderColor: theme.textWhite,
            borderWidth: 0.5,
        },
        name: {
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
    });
});

export default reduxConnector(withTheme(MatchSuccessModalClass));
