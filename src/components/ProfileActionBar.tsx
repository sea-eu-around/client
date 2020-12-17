import * as React from "react";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import {UserProfile} from "../model/user-profile";
import {MaterialIcons} from "@expo/vector-icons";
import {styleTextLight} from "../styles/general";

export type ProfileActionBarProps = {
    profile: UserProfile | null;
} & ThemeProps;

function ProfileActionBar(props: ProfileActionBarProps): JSX.Element {
    const {profile, theme} = props;
    const styles = themedStyles(theme);

    // TODO implement button actions

    const buttons: Omit<ActionButtonProps, "theme">[] = [
        {
            text: "Unmatch",
            icon: "close",
            backgroundColor: theme.accentSecondary,
            color: theme.textBlack,
        },
        {text: "Block", icon: "block", backgroundColor: theme.warn, color: theme.textBlack},
        {text: "Report", icon: "report", backgroundColor: theme.error, color: theme.textBlack},
    ];

    return (
        <View style={styles.container}>
            {buttons.map((b, i) => (
                <ActionButton
                    key={`profile-action-bar-${i}`}
                    theme={theme}
                    text={b.text}
                    icon={b.icon}
                    backgroundColor={b.backgroundColor}
                    color={b.color}
                />
            ))}
        </View>
    );
}

type ActionButtonProps = {
    theme: Theme;
    text: string;
    icon?: string;
    backgroundColor: string;
    color: string;
};

function ActionButton({theme, text, icon, backgroundColor, color}: ActionButtonProps) {
    const styles = themedStyles(theme);
    return (
        <TouchableOpacity style={styles.button} activeOpacity={0.75}>
            {icon && <MaterialIcons name={icon} style={[styles.buttonIcon, {color, backgroundColor}]} />}
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
            marginBottom: 5,

            paddingVertical: 10,
            backgroundColor: theme.accent,

            shadowColor: "#000",
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6,
        },
        button: {
            width: 75,
            marginHorizontal: 10,
            flexDirection: "column",
            alignItems: "center",
        },
        buttonText: {
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            color: theme.textWhite,
            ...styleTextLight,
        },
        buttonIcon: {
            fontSize: 24,
            width: 36,
            height: 36,
            textAlign: "center",
            textAlignVertical: "center",
            borderRadius: 60,
            marginBottom: 5,
        },
    });
});

export default withTheme(ProfileActionBar);
