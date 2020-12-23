import * as React from "react";
import {Text, TouchableOpacity, View, StyleSheet, Dimensions, Keyboard} from "react-native";
import {ThemeConsumer} from "react-native-elements";
import ReAnimated, {Easing} from "react-native-reanimated";
import {Theme, ThemeProps} from "../../types";
import {MaterialIcons} from "@expo/vector-icons";
import {navigateBack} from "../../navigation/utils";
import {preTheme} from "../../styles/utils";
import {getLocalSvg} from "../../assets";
import {useSafeAreaInsets, EdgeInsets} from "react-native-safe-area-context";
import i18n from "i18n-js";

// Component props
type LoginHeaderProps = ThemeProps & {insets: EdgeInsets};

type LoginHeaderState = {
    height: ReAnimated.Value<number>;
    collapsed: boolean;
};

class LoginHeaderClass extends React.Component<LoginHeaderProps, LoginHeaderState> {
    constructor(props: LoginHeaderProps) {
        super(props);
        this.state = {
            height: new ReAnimated.Value<number>(this.getFullHeight()),
            collapsed: false,
        };
    }

    back() {
        navigateBack("WelcomeScreen");
    }

    getCollapsedHeight(): number {
        return 180 + this.props.insets.top;
    }

    getFullHeight(): number {
        return Dimensions.get("window").height * 0.4 + this.props.insets.top;
    }

    componentDidMount() {
        Keyboard.addListener("keyboardDidShow", () => {
            ReAnimated.timing(this.state.height, {
                toValue: this.getCollapsedHeight(),
                duration: 100,
                easing: Easing.cubic,
            }).start();
            // this.state.height.setValue(this.getCollapsedHeight());
            this.setState({...this.state, collapsed: true});
        });
        Keyboard.addListener("keyboardDidHide", () => {
            ReAnimated.timing(this.state.height, {
                toValue: this.getFullHeight(),
                duration: 100,
                easing: Easing.cubic,
            }).start();
            // this.state.height.setValue(this.getFullHeight());
            this.setState({...this.state, collapsed: false});
        });
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const {height} = this.state;

        const styles = themedStyles(theme);
        const Image = getLocalSvg("welcome", () => this.forceUpdate());

        //const height = collapsed ? this.getCollapsedHeight() : this.getFullHeight();

        return (
            <ReAnimated.View style={[styles.container, {height}]}>
                <TouchableOpacity style={styles.navigationButton} onPress={() => this.back()}>
                    <MaterialIcons name="chevron-left" style={styles.navigationIcon} />
                </TouchableOpacity>
                <Text style={styles.title}>{i18n.t("loginForm.title")}</Text>
                <View style={styles.image}>
                    <Image width="100%" />
                </View>
            </ReAnimated.View>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            backgroundColor: theme.accent,
            width: "100%",
            padding: 40,
            overflow: "hidden",
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
            width: "100%",
            height: 200,
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
