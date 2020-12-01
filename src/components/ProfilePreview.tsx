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
import FormattedUniversity from "./FormattedUniversity";
import {PARTNER_UNIVERSITIES, University} from "../constants/universities";
import {OfferValueDto, SpokenLanguageDto} from "../api/dto";
import {styleTextLight, styleTextThin} from "../styles/general";

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
    animating: boolean;
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
            animating: false,
        };
        this.layout = {x: 0, y: 0, width: 0, height: 0};
    }

    expand() {
        const duration = 200;
        this.setState({...this.state, animating: true});
        ReAnimated.timing(this.state.height, {
            toValue: PROFILE_PREVIEW_EXPANDED_HEIGHT,
            duration,
            easing: Easing.elastic(1.0),
        }).start();
        setTimeout(() => this.setState({...this.state, animating: false, expanded: true}), duration);
    }

    collapse() {
        const duration = 100;
        this.setState({...this.state, animating: true, expanded: false});
        ReAnimated.timing(this.state.height, {
            toValue: PROFILE_PREVIEW_COLLAPSED_HEIGHT,
            duration,
            easing: Easing.out(Easing.linear),
        }).start();
        setTimeout(() => this.setState({...this.state, animating: false}), duration);
    }

    hide(onFinish?: () => void) {
        const duration = this.state.expanded ? 160 : 120;
        this.setState({...this.state, animating: true, expanded: false});
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
        if (!this.state.expanded) {
            this.expand();
            if (this.props.onExpand) this.props.onExpand(this.layout);
        } else this.collapse();
    }

    render() {
        const {theme, profile, style} = this.props;
        const {expanded, animating, height, blockModalOpen} = this.state;
        const styles = themedStyles(theme);

        const university = PARTNER_UNIVERSITIES.find((univ: University) => univ.key == profile.university);
        const fullName = profile.firstName + " " + profile.lastName;
        //const fullName = profile.firstName.length % 2 == 0 ? profile.firstName + " " + profile.lastName : "Jimmy Jim McLongname";

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
                        // if (this.props.onSwipeLeft) this.props.onSwipeLeft();
                        // TODO decide
                        this.hide(() => {
                            if (this.props.onSwipeLeft) this.props.onSwipeLeft();
                        });
                    }}
                    onSwipeableLeftWillOpen={() => {
                        // if (this.props.onSwipeRight) this.props.onSwipeRight();
                        this.hide(() => {
                            if (this.props.onSwipeRight) this.props.onSwipeRight();
                        });
                    }}
                    leftThreshold={100}
                    rightThreshold={100}
                    renderRightActions={() => (
                        <Animated.View style={[styles.swipeAction, styles.swipeActionRight]}>
                            <View style={[styles.swipeActionContent, styles.swipeActionContentRight]}>
                                <Text style={styles.swipeActionText}>{i18n.t("matching.actionHide")}</Text>
                            </View>
                        </Animated.View>
                    )}
                    renderLeftActions={() => (
                        <View style={[styles.swipeAction, styles.swipeActionLeft]}>
                            <View style={[styles.swipeActionContent, styles.swipeActionContentLeft]}>
                                <Text style={styles.swipeActionText}>{i18n.t("matching.actionLike")}</Text>
                            </View>
                        </View>
                    )}
                >
                    <TouchableOpacity
                        onPress={() => this.toggleExpanded()}
                        activeOpacity={0.75}
                        style={styles.touchable}
                    >
                        <View style={styles.collapsedContent}>
                            <View style={styles.avatarContainer}>
                                <Avatar
                                    size={120}
                                    rounded
                                    title={(profile.firstName[0] + profile.lastName[0]).toUpperCase()}
                                    containerStyle={styles.avatar}
                                    source={
                                        profile.avatarUrl && profile.avatarUrl !== ""
                                            ? {uri: profile.avatarUrl}
                                            : undefined
                                    }
                                ></Avatar>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.name}>{fullName}</Text>
                                {university && <FormattedUniversity style={styles.infoText} university={university} />}
                                <Text style={styles.infoText}>
                                    {i18n.t(`genders.${profile.gender}`)}
                                    {", "}
                                    {i18n.t(`allRoles.${profile.type}`)} (
                                    {profile.type == "staff"
                                        ? i18n.t(`staffRoles.${profile.staffRole}`)
                                        : i18n.t(`degrees.${profile.degree}`)}
                                    )
                                </Text>
                                {/*<Text style={styles.infoText}>{i18n.t(`genders.${profile.gender}`)}</Text>*/}
                            </View>
                        </View>
                        {(expanded || animating) && (
                            <View style={styles.expandedContent}>
                                <Text style={styles.expandedSectionTitle}>{i18n.t("spokenLanguages")}</Text>
                                <View style={styles.chipsContainer}>
                                    {profile.languages.map((l: SpokenLanguageDto) => (
                                        <ItemChip
                                            key={`${profile.id}-${l.code}`}
                                            text={`${i18n.t(`languageNames.${l.code}`)}${
                                                l.level != "native" ? ` (${l.level.toUpperCase()})` : ""
                                            }`}
                                        />
                                    ))}
                                </View>
                                <Text style={styles.expandedSectionTitle}>{i18n.t("offers")}</Text>
                                <View style={styles.chipsContainer}>
                                    {profile.profileOffers.map((offer: OfferValueDto) => (
                                        <ItemChip
                                            key={`${profile.id}-${offer.offerId}`}
                                            text={i18n.t(`allOffers.${offer.offerId}.name`)}
                                        />
                                    ))}
                                </View>
                                {/*<Text style={styles.expandedSectionTitle}>{i18n.t("fieldsOfEducation")}</Text>
                                <View style={styles.chipsContainer}>
                                    {profile.educationFields.map((fieldId: string) => (
                                        <ItemChip
                                            key={`${profile.id}-${fieldId}`}
                                            text={i18n.t(`educationFields.${fieldId}`)}
                                        />
                                    ))}
                                </View>
                                */}
                                {/*
                                <Text style={styles.expandedSectionTitle}>{i18n.t("interests")}</Text>
                                <View style={styles.chipsContainer}>
                                    {profile.interests.map((interestId: string) => (
                                        <ItemChip
                                            key={`${profile.id}-${interestId}`}
                                            text={i18n.t(`interests.${interestId}`)}
                                        />
                                    ))}
                                </View>
                                */}
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
                            </View>
                        )}
                    </TouchableOpacity>
                </Swipeable>
            </ReAnimated.View>
        );
    }
}

const chipStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        chip: {
            backgroundColor: theme.accentSlight,
            borderRadius: 6,
            //paddingHorizontal: 7,
            paddingHorizontal: 4,
            paddingVertical: 2,
            marginHorizontal: 2,
            marginVertical: 2,
            flexGrow: 1,
            alignItems: "center",
        },
        chipText: {
            fontSize: 14,
            color: theme.textBlack,
        },
    });
});

const ItemChip = withTheme(
    ({text, theme}: {text: string} & ThemeProps): JSX.Element => {
        const styles = chipStyles(theme);
        return (
            <View style={styles.chip}>
                <Text style={styles.chipText}>{text}</Text>
            </View>
        );
    },
);

export const Separator = withTheme(({theme}: ThemeProps) => {
    return <View style={themedStyles(theme).separator}></View>;
});

const sideMargin = 15;
const verticalSpacing = 10;
const cardPadding = 10;
const PROFILE_PREVIEW_COLLAPSED_HEIGHT = 180;
const PROFILE_PREVIEW_EXPANDED_HEIGHT = 400;

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
            textTransform: "uppercase",
            ...styleTextThin,
        },

        separator: {
            height: 1,
            width: "100%",
            backgroundColor: "#000",
            opacity: 0.1,
            alignSelf: "center",
            marginBottom: 5,
        },

        // Card content

        collapsedContent: {
            flexDirection: "row",
            height: PROFILE_PREVIEW_COLLAPSED_HEIGHT - verticalSpacing * 2 - cardPadding * 2,
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
            fontSize: 22,
            letterSpacing: 0.8,
            marginBottom: 5,
            flexShrink: 1, // Ensures text wrapping
            color: theme.text,
        },
        infoText: {
            fontSize: 16,
            letterSpacing: 0.5,
            color: theme.textLight,
            flexShrink: 1, // Ensures text wrapping
        },

        expandedContent: {
            flex: 1,
        },

        chipsContainer: {
            // TODO clean-up
            /*flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: 4,*/
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            //maxHeight: 58,
            overflow: "hidden",
        },
        expandedSectionTitle: {
            ...styleTextLight,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginTop: 5,
            color: theme.text,
        },
        actionContainer: {
            flexDirection: "column",
            flex: 1,
            justifyContent: "flex-end",
        },
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
