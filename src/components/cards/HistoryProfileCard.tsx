import * as React from "react";
import {Text, View, ViewStyle, StyleSheet} from "react-native";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import FormattedUniversity from "../FormattedUniversity";
import ProfileAvatar from "../ProfileAvatar";
import {navigateToProfile} from "../../navigation/utils";
import {MatchHistoryItem} from "../../model/matching";
import FormattedMatchStatus from "../FormattedMatchStatus";
import SwipeableCard, {SwipeableCardClass, SwipeActionButtons, SwipeActionProps} from "./SwipeableCard";
import i18n from "i18n-js";
import store from "../../state/store";
import {MyThunkDispatch} from "../../state/types";
import BlockProfileModal, {BlockProfileModalClass} from "../modals/BlockProfileModal";
import {MatchActionStatus} from "../../api/dto";
import QuickFormReport, {QuickFormReportClass} from "../forms/QuickFormReport";
import {ReportEntityType} from "../../constants/reports";
import {cancelMatchAction} from "../../state/matching/actions";
import SwipeTip from "../SwipeTip";

// Component props
export type HistoryProfileCardProps = ThemeProps & {
    item: MatchHistoryItem;
    style?: ViewStyle;
    onHidden?: () => void;
    showSwipeTip?: boolean;
};

const LOOKS = {
    sideMargin: 10,
    borderRadius: 10,
    minHeight: 100,
};

class HistoryProfileCard extends React.Component<HistoryProfileCardProps> {
    swipeableCardRef = React.createRef<SwipeableCardClass>();
    reportFormRef = React.createRef<QuickFormReportClass>();
    blockModalRef = React.createRef<BlockProfileModalClass>();

    private getActions(hideCard: () => void): SwipeActionProps[] {
        const {
            theme,
            item: {id, status},
        } = this.props;
        const dispatch = store.dispatch as MyThunkDispatch;

        const reportButton = {
            icon: "report",
            text: i18n.t("matching.history.actions.report"),
            backgroundColor: theme.error,
            color: theme.textWhite,
            onPress: () => this.reportFormRef.current?.open(),
        };
        const blockButton = {
            icon: "block",
            text: i18n.t("matching.history.actions.block"),
            backgroundColor: theme.error,
            color: theme.textWhite,
            onPress: () => this.blockModalRef.current?.show(),
        };
        const cancelButton = {
            icon: "close",
            text: i18n.t(`matching.history.actions.cancel.${status}`),
            backgroundColor: theme.accent,
            color: theme.textWhite,
            onPress: () => {
                hideCard();
                dispatch(cancelMatchAction(id));
            },
        };

        if (status === MatchActionStatus.Blocked) return [reportButton, cancelButton];
        else return [reportButton, blockButton, cancelButton];
    }

    render() {
        const {theme, item, showSwipeTip} = this.props;
        const styles = themedStyles(theme);

        const profile = item.profile;
        const fullName = profile.firstName + " " + profile.lastName;

        return (
            <>
                <SwipeableCard
                    ref={this.swipeableCardRef}
                    looks={LOOKS}
                    rightThreshold={100}
                    overshootRight={false}
                    rightActions={(hideCard) => (
                        <SwipeActionButtons
                            id={`${item.profile.id}-${item.status}`}
                            looks={LOOKS}
                            side="right"
                            actions={this.getActions(hideCard)}
                            buttonStyle={styles.actionButton}
                        />
                    )}
                >
                    <View style={styles.cardContent}>
                        <View style={styles.avatarContainer}>
                            <ProfileAvatar
                                profile={profile}
                                size={60}
                                rounded
                                containerStyle={styles.avatar}
                                onPress={() => navigateToProfile(profile.id, store.getState())}
                            />
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.name}>{fullName}</Text>
                            {profile && (
                                <FormattedUniversity
                                    flagSize={14}
                                    flagEmoji={true}
                                    style={[styles.infoText, {marginLeft: -10}]}
                                    university={profile.university}
                                />
                            )}
                            <FormattedMatchStatus
                                status={item.status}
                                textStyle={styles.infoText}
                                iconStyle={styles.infoText}
                            />
                        </View>
                        {showSwipeTip && <SwipeTip direction="left" iconStyle={styles.swipeTipIcon} />}
                    </View>
                </SwipeableCard>
                <QuickFormReport
                    ref={this.reportFormRef}
                    entityType={ReportEntityType.PROFILE_ENTITY}
                    entity={profile}
                    onSubmit={() => this.swipeableCardRef.current?.resetSwipe()}
                />
                <BlockProfileModal
                    ref={this.blockModalRef}
                    profile={profile}
                    onBlock={() => this.swipeableCardRef.current?.collapse()}
                />
            </>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        cardContent: {
            flexDirection: "row",
            padding: 10,
        },
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

        swipeTipIcon: {
            color: theme.textLight,
            fontSize: 18,
        },

        actionButton: {
            paddingHorizontal: 5,
        },
    });
});

export default withTheme(HistoryProfileCard);
