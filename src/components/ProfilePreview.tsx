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
import {UserProfile} from "../model/user-profile";
import ReAnimated, {Easing} from "react-native-reanimated";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {MaterialIcons} from "@expo/vector-icons";
import BlockProfileModal from "./modals/BlockProfileModal";
import {MyThunkDispatch} from "../state/types";
import {blockProfile} from "../state/matching/actions";
import store from "../state/store";

// Component props
export type ProfilePreviewProps = ThemeProps & {
    profile: UserProfile;
    style?: ViewStyle;
    onExpand?: (layout: LayoutRectangle) => void;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onHidden?: () => void;
};

// Component state
export type ProfilePreviewState = {
    expanded: boolean;
    height: ReAnimated.Value<number>;
    blockModalOpen: boolean;
};

class ProfilePreview extends React.Component<ProfilePreviewProps, ProfilePreviewState> {
    layout: LayoutRectangle;

    constructor(props: ProfilePreviewProps) {
        super(props);
        this.state = {
            expanded: false,
            height: new ReAnimated.Value(PROFILE_PREVIEW_COLLAPSED_HEIGHT),
            blockModalOpen: false,
        };
        this.layout = {x: 0, y: 0, width: 0, height: 0};
    }

    expand() {
        // Will change fadeAnim value to 1 in 5 seconds
        ReAnimated.timing(this.state.height, {
            toValue: PROFILE_PREVIEW_EXPANDED_HEIGHT,
            duration: 200,
            easing: Easing.elastic(1.0),
        }).start();
    }

    collapse() {
        // Will change fadeAnim value to 0 in 5 seconds
        ReAnimated.timing(this.state.height, {
            toValue: PROFILE_PREVIEW_COLLAPSED_HEIGHT,
            duration: 100,
            easing: Easing.out(Easing.linear),
        }).start();
    }

    hide(onFinish?: () => void) {
        const duration = this.state.expanded ? 160 : 120;
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

    toggleExpanded() {
        this.setState({...this.state, expanded: !this.state.expanded});
        if (!this.state.expanded) {
            this.expand();
            if (this.props.onExpand) this.props.onExpand(this.layout);
        } else this.collapse();
    }

    render() {
        const {theme, profile, style} = this.props;
        const {expanded, height, blockModalOpen} = this.state;
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
                        if (this.props.onSwipeLeft) this.props.onSwipeLeft();
                        this.hide();
                    }}
                    onSwipeableLeftWillOpen={() => {
                        if (this.props.onSwipeRight) this.props.onSwipeRight();
                        this.hide();
                    }}
                    //leftThreshold={400}
                    //rightThreshold={300}
                    renderRightActions={() => (
                        <Animated.View style={[styles.swipeAction, styles.swipeActionRight]}>
                            <View style={[styles.swipeActionContent, styles.swipeActionContentRight]}>
                                <Text style={styles.swipeActionText}>HIDE</Text>
                            </View>
                        </Animated.View>
                    )}
                    renderLeftActions={() => (
                        <View style={[styles.swipeAction, styles.swipeActionLeft]}>
                            <View style={[styles.swipeActionContent, styles.swipeActionContentLeft]}>
                                <Text style={styles.swipeActionText}>MATCH</Text>
                            </View>
                        </View>
                    )}
                >
                    <TouchableOpacity
                        onPress={() => this.toggleExpanded()}
                        activeOpacity={0.75}
                        style={styles.touchable}
                    >
                        <View style={styles.avatarContainer}>
                            <Avatar
                                size={120}
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
                            <Text style={styles.infoText}>{i18n.t(`universities.${profile.university}`)}</Text>
                            <Text style={styles.infoText}>
                                {i18n.t(`allRoles.${profile.staffRole ? "staff" : "student"}`)} (
                                {profile.staffRole
                                    ? i18n.t(`staffRoles.${profile.staffRole}`)
                                    : i18n.t(`degrees.${profile.degree}`)}
                                )
                            </Text>
                            <Text style={styles.infoText}>{i18n.t(`genders.${profile.gender}`)}</Text>
                        </View>
                        {expanded && (
                            <>
                                <TouchableOpacity
                                    style={styles.blockButton}
                                    onPress={() => this.setState({...this.state, blockModalOpen: true})}
                                >
                                    <MaterialIcons style={styles.blockButtonIcon} name="block" />
                                </TouchableOpacity>
                                {blockModalOpen && (
                                    <BlockProfileModal
                                        profile={profile}
                                        onHide={() => this.setState({...this.state, blockModalOpen: false})}
                                        onBlock={() => {
                                            this.hide(() =>
                                                (store.dispatch as MyThunkDispatch)(blockProfile(profile.id)),
                                            );
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </TouchableOpacity>
                </Swipeable>
            </ReAnimated.View>
        );
    }
}

/*<View style={styles.actionContainer}>
    <TouchableOpacity style={styles.matchButton}>
        <Text style={styles.matchButtonText}>MATCH</Text>
    </TouchableOpacity>
</View>*/

/*

{university && (
    <FormattedUniversity
        containerStyle={styles.universityContainer}
        style={styles.university}
        university={university}
    ></FormattedUniversity>
)}

<InputLabel>{i18n.t("dateOfBirth")}</InputLabel>
<FormattedDate date={profile.birthdate} />

<Spacer></Spacer>
<InputLabel>{i18n.t("gender")}</InputLabel>
<Text>{i18n.t(`genders.${profile.gender}`)}</Text>
*/

/*

<Spacer></Spacer>
<InputLabel>{i18n.t("nationality")}</InputLabel>
<FormattedNationality countryCode={profile.nationality} />
*/

const sideMargin = 15;
const verticalSpacing = 10;
const PROFILE_PREVIEW_COLLAPSED_HEIGHT = 200;
const PROFILE_PREVIEW_EXPANDED_HEIGHT = 500;

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
            padding: 10,
            backgroundColor: theme.cardBackground,
        },
        touchable: {
            width: "100%",
            height: "100%",
            flexDirection: "row",
        },
        swipeAction: {
            width: "100%",
            marginHorizontal: sideMargin,
            marginVertical: verticalSpacing,
        },
        swipeActionLeft: {
            paddingRight: sideMargin * 2,
        },
        swipeActionRight: {
            paddingLeft: sideMargin * 2,
        },
        swipeActionContent: {
            padding: 20,
            borderRadius: 10,
            justifyContent: "center",
            width: "100%",
            height: "100%",
        },
        swipeActionContentRight: {
            backgroundColor: theme.accentTernary,
            alignItems: "flex-end",
        },
        swipeActionContentLeft: {
            backgroundColor: theme.accentSlight,
        },
        swipeActionText: {
            fontSize: 24,
            letterSpacing: 2,
            fontFamily: "sans-serif-thin",
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
            fontSize: 24,
            letterSpacing: 0.8,
            color: theme.text,
        },
        infoText: {
            fontSize: 18,
            color: theme.textLight,
        },
        /*university: {
            fontSize: 14,
            color: theme.text,
        },
        universityContainer: {
            marginVertical: 5,
        },*/
        actionContainer: {
            flexDirection: "column",
            flex: 1,
            justifyContent: "flex-end",
        },
        /*matchButton: {
            width: "100%",
            paddingVertical: 10,
            borderRadius: 2,
            backgroundColor: theme.accent,
        },
        matchButtonText: {
            fontSize: 20,
            letterSpacing: 2,
            textAlign: "center",
            color: theme.textInverted,
        },*/
        blockButton: {
            position: "absolute",
            bottom: 0,
            right: 0,
        },
        blockButtonIcon: {
            fontSize: 30,
            color: theme.error,
        },
    });
});

export default withTheme(ProfilePreview);
