import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import i18n from "i18n-js";
import {RootNavigatorScreens} from "../navigation/types";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import ScreenWrapper from "./ScreenWrapper";
import {styleTextLight} from "../styles/general";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import AsyncButton from "../components/AsyncButton";
import {connectToBackend} from "../hooks/useCachedResources";
import {getInitialRoute, rootNavigate} from "../navigation/utils";

export type BackendUnreachableScreenProps = StackScreenProps<RootNavigatorScreens, "BackendUnreachableScreen"> &
    ThemeProps;

class BackendUnreachableScreen extends React.Component<BackendUnreachableScreenProps> {
    private async retry(): Promise<void> {
        const {reachable, userLoggedInFromCache} = await connectToBackend();
        if (reachable)
            rootNavigate(getInitialRoute(!!userLoggedInFromCache, userLoggedInFromCache?.onboarded || false));
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper forceFullWidth containerStyle={{justifyContent: "center"}}>
                <View style={styles.iconBanner}>
                    <MaterialCommunityIcons name="server-network-off" style={styles.icon} />
                </View>
                <View style={styles.container}>
                    <Text style={styles.title}>{i18n.t("backendUnreachable.title")}</Text>
                    <Text style={styles.subtitle}>{i18n.t("backendUnreachable.subtitle")}</Text>
                    <AsyncButton
                        style={styles.retryButton}
                        icon={<MaterialIcons style={styles.retryIcon} name="refresh" />}
                        onPress={async () => await this.retry()}
                        loadingIndicatorColor={theme.text}
                        loadingIndicatorStyle={styles.retryLoading}
                        loadingIndicatorSize={36}
                    />
                </View>
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
        },
        iconBanner: {
            width: "100%",
            height: 80,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.error,
        },
        icon: {
            fontSize: 48,
            color: theme.textWhite,
        },
        title: {
            fontSize: 36,
            maxWidth: 450,
            ...styleTextLight,
            textAlign: "center",
            color: theme.text,
        },
        subtitle: {
            fontSize: 18,
            maxWidth: 400,
            marginTop: 40,
            marginBottom: 20,
            textAlign: "center",
            color: theme.text,
        },
        retryButton: {
            padding: 10,
        },
        retryIcon: {
            fontSize: 48,
            color: theme.text,
        },
        retryLoading: {
            marginTop: 20,
        },
    });
});

export default withTheme(BackendUnreachableScreen);
