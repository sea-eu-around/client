import * as React from "react";
import {LayoutChangeEvent, LayoutRectangle, Text, TouchableOpacity, View, StyleSheet, Platform} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import {UserProfile, UserProfileStudent} from "../../model/user-profile";
import ReAnimated, {Easing} from "react-native-reanimated";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {MaterialIcons} from "@expo/vector-icons";
import BlockProfileModal from "../modals/BlockProfileModal";
import FormattedUniversity from "../FormattedUniversity";
import {OfferValueDto, SpokenLanguageDto} from "../../api/dto";
import {styleTextLight, styleTextThin} from "../../styles/general";
import ProfileAvatar from "../ProfileAvatar";
import Chips from "../Chips";
import SwipeableCard, {SwipeableCardClass, SwipeActionContainer} from "./SwipeableCard";
import SwipeTip from "../SwipeTip";

// Component props
export type MatchProfileCardProps = ThemeProps & {
    profile: UserProfile;
    onExpand?: (layout: LayoutRectangle) => void;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onHidden?: () => void;
    showSwipeTip?: boolean;
};

// Component state
export type MatchProfileCardState = {
    expanded: boolean;
    animating: boolean;
    height: ReAnimated.Value<number>;
};

const LOOKS = {
    sideMargin: 15,
    verticalSpacing: 10,
    borderRadius: 20,
};

class MatchProfileCard extends React.Component<MatchProfileCardProps, MatchProfileCardState> {
    cardRef = React.createRef<SwipeableCardClass>();
    layout: LayoutRectangle;

    constructor(props: MatchProfileCardProps) {
        super(props);
        this.state = {
            expanded: false,
            height: new ReAnimated.Value(PROFILE_PREVIEW_COLLAPSED_HEIGHT),
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

    hide(onFinish?: () => void, right?: boolean) {
        /*const duration = this.state.expanded ? 160 : 120;
        this.setState({...this.state, animating: true, expanded: false});
        ReAnimated.timing(this.state.height, {
            toValue: 0,
            duration,
            easing: Easing.linear,
        }).start();
        setTimeout(() => {
            if (onFinish) onFinish();
            this.cardRef.current?.hide();
            if (this.props.onHidden) this.props.onHidden();
        }, duration);*/
        this.cardRef.current?.collapse(onFinish, right);
    }

    toggleExpanded() {
        if (!this.state.expanded) {
            this.expand();
            if (this.props.onExpand) this.props.onExpand(this.layout);
        } else this.collapse();
    }

    render() {
        const {theme, profile, showSwipeTip} = this.props;
        const {expanded, animating, height} = this.state;
        const styles = themedStyles(theme);

        const fullName = profile.firstName + " " + profile.lastName;

        const chipStyleProps = {chipStyle: styles.chip};

        return (
            <SwipeableCard
                ref={this.cardRef}
                looks={LOOKS}
                wrapperProps={{
                    onLayout: (e: LayoutChangeEvent) => {
                        this.layout = e.nativeEvent.layout;
                    },
                }}
                useNativeAnimations={Platform.OS !== "web"}
                friction={1}
                leftThreshold={100}
                rightThreshold={100}
                onSwipeableRightWillOpen={() => {
                    this.hide(() => {
                        if (this.props.onSwipeLeft) this.props.onSwipeLeft();
                    }, false);
                }}
                onSwipeableLeftWillOpen={() => {
                    this.hide(() => {
                        if (this.props.onSwipeRight) this.props.onSwipeRight();
                    }, true);
                }}
                renderRightActions={() => (
                    <SwipeActionContainer
                        side="right"
                        looks={LOOKS}
                        fullCardWidth
                        contentStyle={styles.swipeActionContentRight}
                    >
                        <Text style={styles.swipeActionText}>{i18n.t("matching.actionHide")}</Text>
                    </SwipeActionContainer>
                )}
                renderLeftActions={() => (
                    <SwipeActionContainer
                        side="left"
                        looks={LOOKS}
                        fullCardWidth
                        contentStyle={styles.swipeActionContentLeft}
                    >
                        <Text style={styles.swipeActionText}>{i18n.t("matching.actionLike")}</Text>
                    </SwipeActionContainer>
                )}
                onPress={() => this.toggleExpanded()}
            >
                <ReAnimated.View style={[styles.cardContent, {height}]}>
                    <View style={styles.collapsedContent}>
                        <View style={styles.avatarContainer}>
                            <ProfileAvatar profile={profile} size={120} rounded containerStyle={styles.avatar} />
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.name}>{fullName}</Text>
                            {profile && <FormattedUniversity style={styles.infoText} university={profile.university} />}
                            <Text style={styles.infoText}>
                                {i18n.t(`genders.${profile.gender}`)}
                                {", "}
                                {i18n.t(`allRoles.${profile.type}`)}
                                {profile.type == "student"
                                    ? ` (${i18n.t(`degrees.${(profile as UserProfileStudent).degree}`)})`
                                    : ""}
                            </Text>
                            {/*<Text style={styles.infoText}>{i18n.t(`genders.${profile.gender}`)}</Text>*/}
                        </View>
                        {showSwipeTip && (
                            <SwipeTip direction="horizontal" style={styles.swipeTip} iconStyle={styles.swipeTipIcon} />
                        )}
                    </View>
                    {(expanded || animating) && (
                        <View style={styles.expandedContent}>
                            <Text style={styles.expandedSectionTitle}>{i18n.t("spokenLanguages")}</Text>
                            <Chips
                                items={profile.languages}
                                label={(v: SpokenLanguageDto) =>
                                    `${i18n.t(`languageNames.${v.code}`)}${
                                        v.level != "native" ? ` (${v.level.toUpperCase()})` : ""
                                    }`
                                }
                                {...chipStyleProps}
                            />
                            <Text style={styles.expandedSectionTitle}>{i18n.t("offers")}</Text>
                            <Chips
                                items={profile.profileOffers}
                                label={(o: OfferValueDto) => i18n.t(`allOffers.${o.offerId}.name`)}
                                {...chipStyleProps}
                            />

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
                            <BlockProfileModal
                                profile={profile}
                                activator={(open) => (
                                    <TouchableOpacity style={styles.blockButton} onPress={() => open()}>
                                        <MaterialIcons style={styles.blockButtonIcon} name="block" />
                                    </TouchableOpacity>
                                )}
                                onBlock={() => this.hide()}
                            />
                        </View>
                    )}
                </ReAnimated.View>
            </SwipeableCard>
        );
    }
}

export const Separator = withTheme(({theme}: ThemeProps) => {
    return <View style={themedStyles(theme).separator}></View>;
});

const PROFILE_PREVIEW_COLLAPSED_HEIGHT = 150;
const PROFILE_PREVIEW_EXPANDED_HEIGHT = 360;

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        swipeActionContentRight: {
            backgroundColor: theme.accentTernary,
            alignItems: "center",
            justifyContent: "flex-end",
            padding: 20,
        },
        swipeActionContentLeft: {
            backgroundColor: theme.accentSlight,
            alignItems: "center",
            padding: 20,
        },
        swipeActionText: {
            fontSize: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
            ...styleTextThin,
        },

        // Card content

        cardContent: {
            padding: 10,
        },

        collapsedContent: {
            flexDirection: "row",
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

        swipeTip: {
            position: "absolute",
            top: 0,
            right: 5,
        },
        swipeTipIcon: {
            fontSize: 22,
            color: theme.textLight,
        },

        separator: {
            height: 1,
            width: "100%",
            backgroundColor: "#000",
            opacity: 0.1,
            alignSelf: "center",
            marginBottom: 5,
        },

        expandedContent: {
            flex: 1,
        },

        chip: {
            //borderRadius: 6,
            paddingHorizontal: 5,
            paddingVertical: 2,
            flexGrow: 1,
            justifyContent: "center",
        },

        expandedSectionTitle: {
            ...styleTextLight,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginTop: 5,
            color: theme.text,
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

export default withTheme(MatchProfileCard);
