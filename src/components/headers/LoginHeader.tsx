import * as React from "react";
import {Text, TouchableOpacity, StyleSheet, Dimensions, Keyboard, Platform, View} from "react-native";
import {ThemeConsumer} from "react-native-elements";
import ReAnimated, {Easing} from "react-native-reanimated";
import {Theme, ThemeProps} from "../../types";
import {MaterialIcons} from "@expo/vector-icons";
import {rootNavigate} from "../../navigation/utils";
import {preTheme} from "../../styles/utils";
import {getLocalSvg} from "../../assets";
import {useSafeAreaInsets, EdgeInsets} from "react-native-safe-area-context";
import i18n from "i18n-js";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import layout from "../../constants/layout";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    isFirstLaunch: state.settings.isFirstLaunch,
}));

// Component props
type LoginHeaderProps = ThemeProps & {insets: EdgeInsets} & ConnectedProps<typeof reduxConnector>;

export const LOGIN_HEADER_WAVE_HEIGHT = 60;
const SVG_VIEWBOX_W = 620;
const SVG_VIEWBOX_H = 800;

class LoginHeaderClass extends React.Component<LoginHeaderProps> {
    height = new ReAnimated.Value<number>(this.getFullHeight() - LOGIN_HEADER_WAVE_HEIGHT);
    imageTop = new ReAnimated.Value<number>(this.getFullHeight() - this.getImageHeight());

    back(): void {
        Keyboard.dismiss();
        rootNavigate("LoginRoot", {screen: "WelcomeScreen"});
    }

    getImageHeight(): number {
        return (SVG_VIEWBOX_H / SVG_VIEWBOX_W) * Dimensions.get("window").width;
    }

    getCollapsedHeight(): number {
        const minHeightBelow = 550;
        return Dimensions.get("window").height - minHeightBelow + this.props.insets.top;
    }

    getFullHeight(): number {
        const maxHeight = 530;
        const minHeightBelow = 420;
        return Math.min(Dimensions.get("window").height - minHeightBelow + this.props.insets.top, maxHeight);
    }

    componentDidMount() {
        Keyboard.addListener("keyboardDidShow", () => {
            const imageTopVal = this.getCollapsedHeight() - this.getImageHeight();
            const heightVal = this.getCollapsedHeight() - LOGIN_HEADER_WAVE_HEIGHT;

            if (Platform.OS === "web") {
                this.height.setValue(heightVal);
                this.imageTop.setValue(imageTopVal);
            } else {
                const easing: ReAnimated.EasingFunction = Easing.cubic;
                const duration = 100;

                ReAnimated.timing(this.height, {
                    toValue: heightVal,
                    duration,
                    easing,
                }).start();
                ReAnimated.timing(this.imageTop, {
                    toValue: imageTopVal,
                    duration,
                    easing,
                }).start();
            }
        });

        Keyboard.addListener("keyboardDidHide", () => {
            const imageTopVal = this.getFullHeight() - this.getImageHeight();
            const heightVal = this.getFullHeight() - LOGIN_HEADER_WAVE_HEIGHT;

            if (Platform.OS === "web") {
                this.height.setValue(heightVal);
                this.imageTop.setValue(imageTopVal);
            } else {
                const easing: ReAnimated.EasingFunction = Easing.cubic;
                const duration = 100;
                ReAnimated.timing(this.height, {
                    toValue: heightVal,
                    duration,
                    easing,
                }).start();
                ReAnimated.timing(this.imageTop, {
                    toValue: imageTopVal,
                    duration,
                    easing,
                }).start();
            }
        });
    }

    render(): JSX.Element {
        const {theme, isFirstLaunch} = this.props;

        const styles = themedStyles(theme);
        const Image = getLocalSvg("login-header", () => this.forceUpdate());

        return (
            <View style={styles.wrapper}>
                {!layout.isWideDevice && (
                    <ReAnimated.View style={[styles.image, {top: this.imageTop}]}>
                        <Image viewBox={`0 0 ${SVG_VIEWBOX_W} ${SVG_VIEWBOX_H}`} />
                    </ReAnimated.View>
                )}

                <ReAnimated.View style={[styles.container, {height: this.height}]}>
                    <TouchableOpacity style={styles.navigationButton} onPress={() => this.back()}>
                        <MaterialIcons name="chevron-left" style={styles.navigationIcon} />
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        {i18n.t(isFirstLaunch ? "loginForm.titleFirstLaunch" : "loginForm.title")}
                    </Text>
                </ReAnimated.View>
            </View>
        );
    }
}

/*
<ReAnimated.View style={[styles.image, {top: this.imageTop}]}>
    <Image viewBox={`0 0 ${SVG_VIEWBOX_W} ${SVG_VIEWBOX_H}`} />
</ReAnimated.View>
<ReAnimated.View style={[styles.container, {height: this.height}]}>
    <TouchableOpacity style={styles.navigationButton} onPress={() => this.back()}>
        <MaterialIcons name="chevron-left" style={styles.navigationIcon} />
    </TouchableOpacity>
    <Text style={styles.title}>
        {i18n.t(isFirstLaunch ? "loginForm.titleFirstLaunch" : "loginForm.title")}
    </Text>
</ReAnimated.View>
*/

export const themedStyles = preTheme((theme: Theme, wideDevice: boolean) => {
    return StyleSheet.create({
        wrapper: {
            ...(wideDevice
                ? {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "50%",
                      height: "100%",
                      backgroundColor: theme.accent,
                      zIndex: 1,
                  }
                : {zIndex: 1}),
        },
        container: {
            width: "100%",
            padding: 40,
            zIndex: 2,
        },
        navigationButton: {
            width: 50,
            marginLeft: -15,
        },
        navigationIcon: {
            color: theme.textWhite,
            fontSize: 50,
        },
        title: {
            color: theme.textWhite,
            fontSize: 38,
            maxWidth: 210,
            fontFamily: "RalewaySemiBold",
        },
        image: {
            position: "absolute",
            left: 0,
            width: Dimensions.get("window").width,
            aspectRatio: SVG_VIEWBOX_W / SVG_VIEWBOX_H,
            zIndex: 1,
        },
    });
});

function LoginHeader(props: ConnectedProps<typeof reduxConnector>): JSX.Element {
    const insets = useSafeAreaInsets();
    return (
        <ThemeConsumer>
            {(themeProps: ThemeProps) => <LoginHeaderClass {...themeProps} insets={insets} {...props} />}
        </ThemeConsumer>
    );
}

export default reduxConnector(LoginHeader);
