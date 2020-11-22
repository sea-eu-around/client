import * as React from "react";
import {
    LayoutChangeEvent,
    LayoutRectangle,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
    Animated,
    StyleSheet,
} from "react-native";
import i18n from "i18n-js";
import {Avatar, withTheme} from "react-native-elements";
import {UserProfile} from "../../model/user-profile";
import ReAnimated, {Easing} from "react-native-reanimated";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {MaterialIcons} from "@expo/vector-icons";
import {styleTextThin} from "../../styles/general";

// Component props
export type ProfilePreviewProps = ThemeProps & {
    profile: UserProfile;
    style?: ViewStyle;
    onPress?: () => void;
    onHidden?: () => void;
};

// Component state
export type ProfilePreviewState = {
    height: ReAnimated.Value<number>;
};

class ProfileMessagingCard extends React.Component<ProfilePreviewProps, ProfilePreviewState> {
    layout: LayoutRectangle;

    constructor(props: ProfilePreviewProps) {
        super(props);
        this.state = {
            height: new ReAnimated.Value(CARD_HEIGHT),
        };
        this.layout = {x: 0, y: 0, width: 0, height: 0};
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
        const {theme, profile, style, onPress} = this.props;
        const {height} = this.state;
        const styles = themedStyles(theme);

        // const university = PARTNER_UNIVERSITIES.find((univ: University) => univ.key == profile.university);

        return (
            <ReAnimated.View
                style={[styles.wrapper, style, {height}]}
                onLayout={(e: LayoutChangeEvent) => {
                    this.layout = e.nativeEvent.layout;
                }}
            >
                <Swipeable
                    containerStyle={styles.swipeableContainer}
                    childrenContainerStyle={styles.swipeable}
                    onSwipeableRightWillOpen={() => {
                        //this.hide();
                    }}
                    rightThreshold={100}
                    overshootRight={false}
                    renderRightActions={() => (
                        <Animated.View style={styles.swipeAction}>
                            <View style={styles.swipeActionContent}>
                                <SwipeActionButton icon="notifications-off" color={"#ccc"}></SwipeActionButton>
                                <SwipeActionButton icon="report" color={theme.warn}></SwipeActionButton>
                                <SwipeActionButton icon="close" color={theme.error}></SwipeActionButton>
                            </View>
                        </Animated.View>
                    )}
                >
                    <TouchableOpacity
                        onPress={() => {
                            if (onPress) onPress();
                        }}
                        activeOpacity={0.75}
                        style={styles.touchable}
                    >
                        <View style={styles.avatarContainer}>
                            <Avatar
                                size={CARD_HEIGHT - verticalSpacing * 2 - 20}
                                rounded
                                title={(profile.firstName[0] + profile.lastName[0]).toUpperCase()}
                                containerStyle={styles.avatar}
                                source={
                                    profile.avatarUrl && profile.avatarUrl !== "" ? {uri: profile.avatarUrl} : undefined
                                }
                            ></Avatar>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.name}>{profile.firstName + " " + profile.lastName}</Text>
                            <Text style={styles.infoText}>
                                {i18n.t(`allRoles.${profile.staffRole ? "staff" : "student"}`)} (
                                {profile.staffRole
                                    ? i18n.t(`staffRoles.${profile.staffRole}`)
                                    : i18n.t(`degrees.${profile.degree}`)}
                                )
                            </Text>
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
const verticalSpacing = 5;
const CARD_HEIGHT = 75;
const ACTION_BUTTON_WIDTH = CARD_HEIGHT - verticalSpacing * 2;

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            width: "100%",
            overflow: "hidden",
            //paddingHorizontal: 20,
        },
        swipeableContainer: {
            width: "100%",
            paddingHorizontal: sideMargin,
            paddingVertical: verticalSpacing,
        },
        swipeable: {
            width: "100%",
            borderRadius: 4,
            elevation: 1,
            padding: 10,
            backgroundColor: theme.cardBackground,
        },
        touchable: {
            width: "100%",
            height: "100%",
            flexDirection: "row",
        },
        swipeAction: {
            width: ACTION_BUTTON_WIDTH * 3,
            //marginHorizontal: sideMargin,
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
            letterSpacing: 0.5,
            color: theme.text,
        },
        infoText: {
            fontSize: 15,
            color: theme.textLight,
        },
    });
});

export default withTheme(ProfileMessagingCard);
