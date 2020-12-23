import * as React from "react";
import {Text, View, ViewStyle, StyleSheet, Alert} from "react-native";
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
import SwipeableCard, {SwipeActionButtons, SwipeActionProps} from "./SwipeableCard";
import i18n from "i18n-js";
import store from "../state/store";
import {MyThunkDispatch} from "../state/types";
import BlockProfileModal from "./modals/BlockProfileModal";
import {MatchActionStatus} from "../api/dto";

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

    private getActions(hideCard: () => void): SwipeActionProps[] {
        const {
            theme,
            item: {status},
        } = this.props;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const dispatch = store.dispatch as MyThunkDispatch;

        const reportButton = {
            icon: "report",
            text: i18n.t("matching.history.actions.report"),
            backgroundColor: theme.warn,
            color: theme.textWhite,
            onPress: () => {
                Alert.alert("Reports not yet implemented");
            },
        };
        const blockButton = {
            icon: "block",
            text: i18n.t("matching.history.actions.block"),
            backgroundColor: theme.error,
            color: theme.textWhite,
            onPress: () => {
                this.setState({...this.state, blockModalOpen: true});
            },
        };
        const cancelButton = {
            icon: "close",
            text: i18n.t("matching.history.actions.cancel"),
            backgroundColor: theme.accent,
            color: theme.textWhite,
            onPress: () => {
                hideCard();
            },
        };

        if (status === MatchActionStatus.Blocked) return [reportButton, blockButton, cancelButton];
        else return [reportButton, cancelButton];
    }

    render() {
        const {theme, item} = this.props;
        const {blockModalOpen} = this.state;
        const styles = themedStyles(theme);

        const profile = item.profile;
        const university = PARTNER_UNIVERSITIES.find((univ: University) => univ.key == profile.university);
        const fullName = profile.firstName + " " + profile.lastName;

        return (
            <>
                <SwipeableCard
                    looks={LOOKS}
                    rightThreshold={100}
                    overshootRight={false}
                    /*overshootLeft={false}
                    leftActions={() => (
                        <SwipeActionButtons
                            id={`${item.profile.id}-${item.status}`}
                            looks={LOOKS}
                            side="left"
                            actions={[
                                {icon: "report", backgroundColor: theme.warn, color: theme.textWhite},
                                {
                                    icon: "close",
                                    backgroundColor: theme.error,
                                    color: theme.textWhite,
                                },
                            ]}
                        />
                    )}*/
                    rightActions={(hideCard) => (
                        <SwipeActionButtons
                            id={`${item.profile.id}-${item.status}`}
                            looks={LOOKS}
                            side="right"
                            actions={this.getActions(hideCard)}
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
                    </View>
                    <MaterialCommunityIcons name="gesture-swipe-left" style={styles.swipeLeftIcon} />
                </SwipeableCard>
                <BlockProfileModal
                    profile={profile}
                    visible={blockModalOpen}
                    onHide={() => {
                        this.setState({...this.state, blockModalOpen: false});
                    }}
                />
            </>
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
