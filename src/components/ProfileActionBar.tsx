import * as React from "react";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import {UserProfile} from "../model/user-profile";
import {MaterialIcons} from "@expo/vector-icons";
import {styleTextLight} from "../styles/general";
import BlockProfileModal from "./modals/BlockProfileModal";
import QuickFormReport from "./forms/QuickFormReport";
import {ReportEntityType} from "../constants/reports";
import UnmatchProfileModal from "./modals/UnmatchProfileModal";
import i18n from "i18n-js";
import {navigateBack, openChat} from "../navigation/utils";

export type ProfileActionBarProps = {
    profile: UserProfile | null;
    isMatched: boolean;
    roomId: string | null;
} & ThemeProps;

function ProfileActionBar(props: ProfileActionBarProps): JSX.Element {
    const {profile, isMatched, roomId, theme} = props;
    const styles = themedStyles(theme);

    let buttons;

    const buttonBlock = (
        <BlockProfileModal
            profile={profile}
            activator={(open) => (
                <ActionButton blank={!profile} text={i18n.t("profile.action.block")} icon="block" onPress={open} />
            )}
        />
    );

    const buttonReport = (
        <QuickFormReport
            entity={profile}
            entityType={ReportEntityType.PROFILE_ENTITY}
            activator={(open) => (
                <ActionButton blank={!profile} text={i18n.t("profile.action.report")} icon="report" onPress={open} />
            )}
        />
    );

    if (isMatched) {
        const buttonChat = (
            <ActionButton
                blank={!profile}
                text={i18n.t("profile.action.chat")}
                icon="chat"
                onPress={() => roomId && openChat(roomId)}
            />
        );

        // TODO implement chat mute
        /*const buttonMute = (
            <ActionButton blank={!profile} text={i18n.t("profile.action.mute")} icon="notifications-off" />
        );*/
        const buttonMute = <></>;

        const buttonUnmatch = (
            <UnmatchProfileModal
                profile={profile}
                roomId={roomId}
                onSubmit={(block: boolean) => {
                    if (block) navigateBack();
                }}
                activator={(open) => (
                    <ActionButton
                        blank={!profile}
                        text={i18n.t("profile.action.unmatch")}
                        icon="close"
                        onPress={open}
                    />
                )}
            />
        );

        buttons = (
            <>
                {buttonChat}
                {buttonMute}
                {buttonUnmatch}
                {buttonReport}
            </>
        );
    } else {
        buttons = (
            <>
                {buttonBlock}
                {buttonReport}
            </>
        );
    }

    return <View style={styles.container}>{buttons}</View>;
}

type ActionButtonProps = ThemeProps & {
    text: string;
    icon?: string;
    onPress?: () => void;
    blank?: boolean;
};

const ActionButton = withTheme(
    ({text, icon, onPress, blank, theme}: ActionButtonProps): JSX.Element => {
        const styles = themedStyles(theme);
        return (
            <TouchableOpacity style={styles.button} activeOpacity={0.75} onPress={blank ? undefined : onPress}>
                {icon && (
                    <View style={[styles.buttonTop, blank ? styles.buttonTopBlank : {}]}>
                        {!blank && <MaterialIcons name={icon} style={styles.buttonTopIcon} />}
                    </View>
                )}
                <Text style={styles.buttonText}>{text}</Text>
            </TouchableOpacity>
        );
    },
);

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 15,
        },
        button: {
            width: 75,
            marginHorizontal: 10,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        },
        buttonText: {
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            color: theme.textWhite,
            ...styleTextLight,
        },
        buttonTop: {
            fontSize: 24,
            width: 36,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 60,
            marginBottom: 5,
            backgroundColor: "#fff4",
        },
        buttonTopBlank: {
            opacity: 0.4,
            backgroundColor: "transparent",
            borderColor: theme.textWhite,
            borderWidth: 1,
        },
        buttonTopIcon: {
            fontSize: 24,
            color: theme.textInverted,
        },
    });
});

export default withTheme(ProfileActionBar);
