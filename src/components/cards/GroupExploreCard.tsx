import * as React from "react";
import {StyleSheet, Text, View, StyleProp, ViewStyle, Image} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {Group} from "../../model/groups";
import store from "../../state/store";
import {joinGroup} from "../../state/groups/actions";
import {MyThunkDispatch} from "../../state/types";
import GroupJoinRequestSentModal, {GroupJoinRequestSentModalClass} from "../modals/GroupJoinRequestSentModal";
import GroupJoinedModal, {GroupJoinedModalClass} from "../modals/GroupJoinedModal";
import SwipeableCard, {SwipeableCardClass, SwipeableLooks, SwipeActionContainer} from "./SwipeableCard";
import GroupDescriptionModal, {GroupDescriptionModalClass} from "../modals/GroupDescriptionModal";
import LocalImage from "../LocalImage";
import {BlurView} from "expo-blur";
import {GroupMemberStatus} from "../../api/dto";
import {MaterialIcons} from "@expo/vector-icons";
import i18n from "i18n-js";

// Component props
type GroupExploreCardProps = {
    group: Group | null;
    style?: StyleProp<ViewStyle>;
} & ThemeProps;

class GroupExploreCard extends React.Component<GroupExploreCardProps> {
    descriptionModalRef = React.createRef<GroupDescriptionModalClass>();
    requestSentModalRef = React.createRef<GroupJoinRequestSentModalClass>();
    joinedModalRef = React.createRef<GroupJoinedModalClass>();
    cardRef = React.createRef<SwipeableCardClass>();

    private join(): void {
        const {group} = this.props;

        if (group) {
            (store.dispatch as MyThunkDispatch)(joinGroup(group));

            if (group.requiresApproval) this.requestSentModalRef.current?.show();
            else this.joinedModalRef.current?.show();
        }
    }

    render(): JSX.Element {
        const {theme, group} = this.props;

        const styles = themedStyles(theme);
        const looks: Partial<SwipeableLooks> = {verticalSpacing: 5, sideMargin: 15};
        const status = group?.myStatus;
        const statusTextKey = "groups.explore.statusText";

        const canRequestJoin =
            status !== GroupMemberStatus.Approved &&
            status !== GroupMemberStatus.Banned &&
            status !== GroupMemberStatus.Pending;

        return (
            <SwipeableCard
                ref={this.cardRef}
                looks={looks}
                renderRightActions={() => <SwipeActionContainer side="right" looks={looks} fullCardWidth />}
                style={styles.card}
                {...(canRequestJoin ? {onPress: () => this.descriptionModalRef.current?.show()} : {})}
            >
                {group && group.cover && (
                    <Image style={styles.groupCover} source={{uri: group.cover}} resizeMode="cover" />
                )}
                {(!group || !group.cover) && (
                    <LocalImage style={styles.groupCover} imageKey="group-placeholder" resizeMode="cover" />
                )}
                <BlurView style={styles.blurView} tint="dark" intensity={10} />

                <View style={styles.innerContent}>
                    {group && (
                        <Text style={styles.groupName} numberOfLines={2}>
                            {group.name}
                        </Text>
                    )}
                    <View style={styles.subtitleContainer}>
                        {status === GroupMemberStatus.Pending ? (
                            <>
                                <Text style={styles.statusSpecific}>{i18n.t(`${statusTextKey}.pending`)}</Text>
                                <MaterialIcons name="check" style={styles.statusSpecificIcon} />
                            </>
                        ) : status === GroupMemberStatus.Banned ? (
                            <>
                                <Text style={styles.statusSpecific}>{i18n.t(`${statusTextKey}.banned`)}</Text>
                                <MaterialIcons name="block" style={[styles.statusSpecificIcon, {color: theme.error}]} />
                            </>
                        ) : status === GroupMemberStatus.Invited || status === GroupMemberStatus.InvitedByAdmin ? (
                            <>
                                <Text style={styles.statusSpecific}>{i18n.t(`${statusTextKey}.invited`)}</Text>
                                <MaterialIcons name="person-add" style={styles.statusSpecificIcon} />
                            </>
                        ) : (
                            group &&
                            group.description.length > 0 && (
                                <Text style={styles.groupDescription} numberOfLines={1}>
                                    {group.description}
                                </Text>
                            )
                        )}
                    </View>
                </View>

                <GroupJoinRequestSentModal
                    ref={this.requestSentModalRef}
                    onHide={() => this.cardRef.current?.collapse()}
                />
                {group && (
                    <>
                        <GroupDescriptionModal
                            ref={this.descriptionModalRef}
                            group={group}
                            onJoinGroup={() => this.join()}
                        />
                        <GroupJoinedModal
                            ref={this.joinedModalRef}
                            group={group}
                            onHide={() => this.cardRef.current?.collapse()}
                        />
                    </>
                )}
            </SwipeableCard>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        card: {
            backgroundColor: theme.cardBackground,
            height: 75,
        },
        blurView: {
            position: "absolute",
            width: "100%",
            height: "100%",
        },
        groupCover: {
            position: "absolute",
            width: "100%",
            height: "100%",
        },
        innerContent: {
            justifyContent: "center",
            paddingHorizontal: 10,
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
        groupName: {
            color: theme.textWhite,
            fontFamily: "RalewaySemiBold",
            fontSize: 16,
        },
        subtitleContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        groupDescription: {
            color: theme.textWhite,
            fontSize: 14,
        },
        statusSpecific: {
            fontFamily: "RalewaySemiBold",
            color: theme.textWhite,
            fontSize: 14,
        },
        statusSpecificIcon: {
            color: theme.textWhite,
            fontSize: 14,
            marginLeft: 4,
        },
    });
});

export default withTheme(GroupExploreCard);
