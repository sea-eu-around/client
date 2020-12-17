import * as React from "react";
import {Text, TouchableOpacity, View, ViewStyle, Animated, StyleSheet, Platform} from "react-native";
import {withTheme} from "react-native-elements";
import {UserProfile} from "../model/user-profile";
import ReAnimated, {Easing} from "react-native-reanimated";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import FormattedUniversity from "./FormattedUniversity";
import {PARTNER_UNIVERSITIES, University} from "../constants/universities";
import {styleTextThin} from "../styles/general";
import ProfileAvatar from "./ProfileAvatar";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {rootNavigate} from "../navigation/utils";

// Component props
export type HistoryProfileCardProps = ThemeProps & {
    profile: UserProfile;
    style?: ViewStyle;
    onHidden?: () => void;
};

// Component state
export type HistoryProfileCardState = {
    height: ReAnimated.Value<number>;
    blockModalOpen: boolean;
};

class HistoryProfileCard extends React.Component<HistoryProfileCardProps, HistoryProfileCardState> {
    constructor(props: HistoryProfileCardProps) {
        super(props);
        this.state = {
            height: new ReAnimated.Value(CARD_HEIGHT),
            blockModalOpen: false,
        };
    }

    hide(onFinish?: () => void) {
        const duration = 120;
        ReAnimated.timing(this.state.height, {
            toValue: 0,
            duration,
            easing: Easing.linear,
        }).start();
        setTimeout(() => {
            if (onFinish) onFinish();
            if (this.props.onHidden) this.props.onHidden();
        }, duration);
    }

    render() {
        const {theme, profile, style} = this.props;
        const {height} = this.state;
        const styles = themedStyles(theme);

        const university = PARTNER_UNIVERSITIES.find((univ: University) => univ.key == profile.university);
        const fullName = profile.firstName + " " + profile.lastName;

        return (
            <ReAnimated.View style={[styles.wrapper, style, {height}]}>
                <Swipeable
                    containerStyle={styles.swipeableContainer}
                    childrenContainerStyle={styles.swipeable}
                    useNativeAnimations={Platform.OS !== "web"}
                    friction={1}
                    onSwipeableRightWillOpen={() => {
                        //this.hide();
                        //if (this.props.onSwipeLeft) this.props.onSwipeLeft();
                    }}
                    rightThreshold={100}
                    overshootRight={false}
                    renderRightActions={() => (
                        <Animated.View style={styles.swipeAction}>
                            <View style={styles.swipeActionContent}>
                                <SwipeActionButton icon="report" color={theme.warn} />
                                <SwipeActionButton icon="close" color={theme.error} />
                            </View>
                        </Animated.View>
                    )}
                >
                    <TouchableOpacity activeOpacity={0.75} style={styles.touchable}>
                        <View style={styles.cardContent}>
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
                                <Text style={styles.infoText}>Blocked</Text>
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
                        </View>
                    </TouchableOpacity>
                </Swipeable>
            </ReAnimated.View>
        );
    }
}

type SwipeActionProps = {icon: string; color?: string; onPress?: () => void};

const SwipeActionButton = withTheme(
    (props: SwipeActionProps & ThemeProps): JSX.Element => {
        const {icon, color, onPress, theme} = props;
        const styles = themedStyles(theme);
        return (
            <TouchableOpacity onPress={onPress} style={[styles.swipeActionButton, {backgroundColor: color}]}>
                <MaterialIcons style={styles.swipeActionButtonIcon} name={icon} />
            </TouchableOpacity>
        );
    },
);

const sideMargin = 15;
const verticalSpacing = 8;
const cardPadding = 10;
const CARD_HEIGHT = 100;
const ACTION_BUTTON_WIDTH = CARD_HEIGHT - verticalSpacing * 2;
const N_BUTTONS = 2;

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            width: "100%",
            overflow: "hidden",
        },
        swipeableContainer: {
            width: "100%",
            paddingHorizontal: sideMargin,
            paddingVertical: verticalSpacing,
        },
        swipeable: {
            width: "100%",
            borderRadius: 10,
            elevation: 1,
            padding: cardPadding,
            overflow: "hidden",
            backgroundColor: theme.cardBackground,
        },
        touchable: {
            width: "100%",
            height: "100%",
            flexDirection: "column",
        },

        swipeAction: {
            width: ACTION_BUTTON_WIDTH * N_BUTTONS,
            marginLeft: -sideMargin - 2,
            marginRight: sideMargin,
            marginVertical: verticalSpacing,
        },
        swipeActionContent: {
            flexDirection: "row",
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: theme.accentSecondary,
        },
        swipeActionText: {
            fontSize: 24,
            letterSpacing: 2,
            ...styleTextThin,
        },
        swipeActionButton: {
            width: ACTION_BUTTON_WIDTH,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
        },
        swipeActionButtonIcon: {
            color: theme.textWhite,
            fontSize: 22,
        },

        // Card content

        cardContent: {
            flexDirection: "row",
            height: CARD_HEIGHT - verticalSpacing * 2 - cardPadding * 2,
        },

        avatarContainer: {
            justifyContent: "center",
        },
        avatar: {
            backgroundColor: theme.accentSecondary,
        },
        infoContainer: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 10,
        },
        name: {
            fontSize: 18,
            letterSpacing: 0.8,
            marginBottom: 5,
            flexShrink: 1, // Ensures text wrapping
            color: theme.text,
        },
        infoText: {
            fontSize: 14,
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
