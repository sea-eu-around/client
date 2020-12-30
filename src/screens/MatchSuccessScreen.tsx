import * as React from "react";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {withTheme} from "react-native-elements";
import {openChat, rootNavigate} from "../navigation/utils";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";
import {styleTextThin} from "../styles/general";
import {StackScreenProps} from "@react-navigation/stack";
import {RootNavigatorScreens} from "../navigation/types";
import AsyncButton from "../components/AsyncButton";
import ScreenWrapper from "./ScreenWrapper";

export type MatchSuccessScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;

class MatchSuccessScreen extends React.Component<MatchSuccessScreenProps> {
    getRoomId(): string | null {
        const params = this.props.route.params;
        if (params) {
            const roomId = (params as {[key: string]: string}).roomId;
            return roomId || null;
        }
        return null;
    }

    async chat(): Promise<void> {
        const roomId = this.getRoomId();
        if (roomId) openChat(roomId);
        else rootNavigate("TabMessaging");
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <Text style={styles.title}>{i18n.t("matching.success.title")}</Text>
                    <View style={styles.separator} />
                    <AsyncButton
                        text={i18n.t("matching.success.chat")}
                        textStyle={styles.actionText}
                        style={styles.actionButton}
                        onPress={async () => await this.chat()}
                    />
                    <TouchableOpacity
                        style={[styles.actionButton, {backgroundColor: theme.actionNeutral}]}
                        onPress={() => rootNavigate("TabMatchingScreen")}
                    >
                        <Text style={styles.actionText}>{i18n.t("matching.success.continue")}</Text>
                    </TouchableOpacity>
                </View>
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.okay,
        },
        title: {
            width: "100%",
            textAlign: "center",
            ...styleTextThin,
            fontSize: 32,
            color: theme.text,
            letterSpacing: 1,
            textTransform: "uppercase",
        },
        separator: {
            marginVertical: 30,
            height: 1,
            width: "80%",
            backgroundColor: theme.cardBackground,
            opacity: 0.3,
        },
        actionButton: {
            backgroundColor: theme.accent,
            paddingHorizontal: 30,
            paddingVertical: 10,
            marginVertical: 20,
            borderRadius: 20,
        },
        actionText: {
            color: theme.textWhite,
            fontSize: 18,
            letterSpacing: 1,
            textTransform: "uppercase",
        },
    });
});

export default withTheme(MatchSuccessScreen);
