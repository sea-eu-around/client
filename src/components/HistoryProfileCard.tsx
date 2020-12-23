import * as React from "react";
import {Text, View, ViewStyle, StyleSheet} from "react-native";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import FormattedUniversity from "./FormattedUniversity";
import {PARTNER_UNIVERSITIES, University} from "../constants/universities";
import ProfileAvatar from "./ProfileAvatar";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {rootNavigate} from "../navigation/utils";
import {MatchHistoryItem} from "../model/matching";
import FormattedMatchStatus from "./FormattedMatchStatus";
import SwipeableCard, {SwipeActionButtons} from "./SwipeableCard";

// Component props
export type HistoryProfileCardProps = ThemeProps & {
    item: MatchHistoryItem;
    style?: ViewStyle;
    onHidden?: () => void;
};

// Component state
export type HistoryProfileCardState = {
    blockModalOpen: boolean;
};

const LOOKS = {
    sideMargin: 10,
    borderRadius: 10,
    minHeight: 100,
    maxHeight: 600,
};

class HistoryProfileCard extends React.Component<HistoryProfileCardProps, HistoryProfileCardState> {
    constructor(props: HistoryProfileCardProps) {
        super(props);
        this.state = {
            blockModalOpen: false,
        };
    }

    render() {
        const {theme, item} = this.props;
        const styles = themedStyles(theme);

        const profile = item.profile;
        const university = PARTNER_UNIVERSITIES.find((univ: University) => univ.key == profile.university);
        const fullName = profile.firstName + " " + profile.lastName;

        return (
            <SwipeableCard
                looks={LOOKS}
                rightThreshold={100}
                overshootRight={false}
                //overshootLeft={false}
                leftActions={() => (
                    <SwipeActionButtons
                        id={item.profile.id}
                        looks={LOOKS}
                        side="left"
                        actions={[
                            {icon: "report", color: theme.warn},
                            {icon: "close", color: theme.error},
                        ]}
                    />
                )}
                rightActions={(hideCard) => (
                    <SwipeActionButtons
                        id={item.profile.id}
                        looks={LOOKS}
                        side="right"
                        actions={[
                            {icon: "report", color: theme.warn},
                            {icon: "close", color: theme.error, onPress: () => hideCard()},
                        ]}
                    />
                )}
            >
                <View style={styles.avatarContainer}>
                    <ProfileAvatar
                        profile={profile}
                        size={60}
                        rounded
                        containerStyle={styles.avatar}
                        onPress={() => rootNavigate("ProfileScreen", {id: profile.id})}
                    />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{fullName}</Text>
                    {university && (
                        <FormattedUniversity
                            flagSize={14}
                            flagEmoji={true}
                            style={[styles.infoText, {marginLeft: -10}]}
                            university={university}
                        />
                    )}
                    <FormattedMatchStatus
                        status={item.status}
                        textStyle={styles.infoText}
                        iconStyle={styles.infoText}
                    />
                    {/*<Text style={styles.infoText}>
                            {i18n.t(`genders.${profile.gender}`)}
                            {", "}
                            {i18n.t(`allRoles.${profile.type}`)}
                            {profile.type == "student"
                                ? ` (${i18n.t(`degrees.${(profile as UserProfileStudent).degree}`)})`
                                : ""}
                        </Text>*/}
                </View>
                <MaterialCommunityIcons name="gesture-swipe-left" style={styles.swipeLeftIcon} />
            </SwipeableCard>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        avatarContainer: {
            justifyContent: "center",
            alignItems: "center",
        },
        avatar: {
            backgroundColor: theme.accentSecondary,
        },
        infoContainer: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            paddingLeft: 10,
        },
        name: {
            fontSize: 18,
            letterSpacing: 0.8,
            color: theme.text,
        },
        infoText: {
            fontSize: 15,
            letterSpacing: 0.5,
            color: theme.textLight,
            flexShrink: 1, // Ensures text wrapping
        },

        swipeLeftIcon: {
            color: theme.text,
            opacity: 0.25,
            fontSize: 20,
        },
    });
});

export default withTheme(HistoryProfileCard);
