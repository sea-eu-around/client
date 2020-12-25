import * as React from "react";
import {Text, TouchableOpacity, StyleSheet, Dimensions, Keyboard, Platform} from "react-native";
import {ThemeConsumer} from "react-native-elements";
import ReAnimated, {Easing} from "react-native-reanimated";
import {Theme, ThemeProps} from "../../types";
import {MaterialIcons} from "@expo/vector-icons";
import {rootNavigate} from "../../navigation/utils";
import {preTheme} from "../../styles/utils";
import {getLocalSvg} from "../../assets";
import {useSafeAreaInsets, EdgeInsets} from "react-native-safe-area-context";
import i18n from "i18n-js";

// Component props
type LoginHeaderProps = ThemeProps & {insets: EdgeInsets};

export const LOGIN_HEADER_WAVE_HEIGHT = 60;
const SVG_VIEWBOX_W = 620;
const SVG_VIEWBOX_H = 800;

class LoginHeaderClass extends React.Component<LoginHeaderProps> {
    height = new ReAnimated.Value<number>(this.getFullHeight() - LOGIN_HEADER_WAVE_HEIGHT);
    imageTop = new ReAnimated.Value<number>(this.getFullHeight() - this.getImageHeight());

    back(): void {
        Keyboard.dismiss();
        rootNavigate("WelcomeScreen");
    }

    getImageHeight(): number {
        return (SVG_VIEWBOX_H / SVG_VIEWBOX_W) * Dimensions.get("window").width;
    }

    getCollapsedHeight(): number {
        return 280 + this.props.insets.top;
    }

    getFullHeight(): number {
        const maxHeight = 530;
        return Math.min(Dimensions.get("window").height - 420 + this.props.insets.top, maxHeight);
    }

    componentDidMount() {
        Keyboard.addListener("keyboardDidShow", () => {
            const easing: ReAnimated.EasingFunction = Easing.cubic;
            const duration = 100;

            ReAnimated.timing(this.height, {
                toValue: this.getCollapsedHeight() - LOGIN_HEADER_WAVE_HEIGHT,
                duration,
                easing,
            }).start();
            ReAnimated.timing(this.imageTop, {
                toValue: this.getCollapsedHeight() - this.getImageHeight(),
                duration,
                easing,
            }).start();
        });

        Keyboard.addListener("keyboardDidHide", () => {
            const easing: ReAnimated.EasingFunction = Easing.cubic;
            const duration = 100;

            ReAnimated.timing(this.height, {
                toValue: this.getFullHeight() - LOGIN_HEADER_WAVE_HEIGHT,
                duration,
                easing,
            }).start();
            ReAnimated.timing(this.imageTop, {
                toValue: this.getFullHeight() - this.getImageHeight(),
                duration,
                easing,
            }).start();
        });
    }

    render(): JSX.Element {
        const {theme} = this.props;

        const styles = themedStyles(theme);
        const Image = getLocalSvg("login-header");

        return Platform.OS === "web" ? (
            <></>
        ) : (
            <>
                <ReAnimated.View style={[styles.image, {top: this.imageTop}]}>
                    <Image viewBox={`0 0 ${SVG_VIEWBOX_W} ${SVG_VIEWBOX_H}`} />
                </ReAnimated.View>
                <ReAnimated.View style={[styles.container, {height: this.height}]}>
                    <TouchableOpacity style={styles.navigationButton} onPress={() => this.back()}>
                        <MaterialIcons name="chevron-left" style={styles.navigationIcon} />
                    </TouchableOpacity>
                    <Text style={styles.title}>{i18n.t("loginForm.title")}</Text>
                </ReAnimated.View>
            </>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            padding: 40,
            zIndex: 2,
            //overflow: "hidden",
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
            fontSize: 42,
            maxWidth: 200,
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

export default function LoginHeader(): JSX.Element {
    const insets = useSafeAreaInsets();
    return (
        <ThemeConsumer>
            {(themeProps: ThemeProps) => <LoginHeaderClass {...themeProps} insets={insets} />}
        </ThemeConsumer>
    );
}
