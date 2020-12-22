import React from "react";
import {MaterialTopTabBarProps} from "@react-navigation/material-top-tabs";
import {View, Text, StyleSheet, Dimensions, Keyboard, TouchableOpacity} from "react-native";
import i18n from "i18n-js";
import ReAnimated, {Easing} from "react-native-reanimated";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withSafeAreaInsets, EdgeInsets} from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import Svg, {Path} from "react-native-svg";
import WavyHeader from "./headers/WavyHeader";
import {ThemeProvider} from "@react-navigation/native";

// Component props
type LoginTabBarProps = ThemeProps & MaterialTopTabBarProps & {insets: EdgeInsets};

class TabBarComponent extends React.Component<LoginTabBarProps> {
    height = new ReAnimated.Value<number>(0);

    getCollapsedHeight(): number {
        return 50 + this.props.insets.top;
    }

    getFullHeight(): number {
        return Dimensions.get("window").height * 0.25 + this.props.insets.top;
    }

    componentDidMount() {
        this.height.setValue(this.getFullHeight());
        Keyboard.addListener("keyboardDidShow", () => {
            ReAnimated.timing(this.height, {
                toValue: this.getCollapsedHeight(),
                duration: 50,
                easing: Easing.ease,
            }).start();
        });
        Keyboard.addListener("keyboardDidHide", () => {
            ReAnimated.timing(this.height, {
                toValue: this.getFullHeight(),
                duration: 0,
                easing: Easing.ease,
            }).start();
        });
    }

    onPress(route: {name: string; key: string}, index: number): void {
        const {navigation} = this.props;
        const isFocused = index == this.props.state.index;

        const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
        }
    }

    onLongPress(route: {name: string; key: string}): void {
        const {navigation} = this.props;
        navigation.emit({
            type: "tabLongPress",
            target: route.key,
        });
    }

    render(): JSX.Element {
        const {state, descriptors, position, theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ReAnimated.View style={[{height: this.height}]}>
                <View style={styles.container}>
                    <WavyHeader
                        customStyles={styles.svgCurve}
                        customHeight={160}
                        customTop={130}
                        customBgColor={theme.accent}
                        customWavePattern="M0,160L48,181.3C96,203,192,245,288,261.3C384,277,480,267,576,224C672,181,768,107,864,106.7C960,107,1056,181,1152,202.7C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                    />
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>SEA-EU Around</Text>
                    </View>
                </View>
                {/*<Text style={styles.appTitle}>SEA-EU Around</Text>*/}
                {/*<View style={styles.tabBar}>
                    {state.routes.map((route, index) => {
                        const {options} = descriptors[route.key];
                        const label = i18n.t(route.name.toLowerCase());
                        const isFocused = state.index === index;

                        const inputRange = state.routes.map((_, i) => i);
                        const opacity = Animated.interpolate(position, {
                            inputRange,
                            outputRange: inputRange.map((i) => (i === index ? 0.15 : 0)),
                        });

                        return (
                            <View key={index} style={styles.tabButton}>
                                <Animated.View style={[styles.tabButtonBg, {opacity}]} />
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    accessibilityLabel={options.tabBarAccessibilityLabel}
                                    testID={options.tabBarTestID}
                                    onPress={() => this.onPress(route, index)}
                                    onLongPress={() => this.onLongPress(route)}
                                >
                                    <Text style={[styles.tabButtonText, isFocused ? styles.tabButtonTextFocused : {}]}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>*/}
            </ReAnimated.View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
        },
        headerContainer: {
            marginTop: 50,
            marginHorizontal: 10,
        },
        headerText: {
            fontSize: 18,
            paddingLeft: 10,
            fontWeight: "600",
            // change the color property for better output
            color: "#fff",
            marginTop: 20,
        },
        svgCurve: {
            position: "absolute",
            width: Dimensions.get("window").width,
        },
        /*tabBarWrapper: {
            backgroundColor: theme.background,
            alignItems: "center",
            justifyContent: "flex-end",
        },
        tabBar: {
            width: "100%",
            maxWidth: 420,
            height: 48,
            flexDirection: "row",
        },
        tabButton: {
            flex: 1,
        },
        tabButtonBg: {
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: theme.accentSecondary,
        },
        tabButtonText: {
            fontSize: 18,
            lineHeight: 48,
            letterSpacing: 1,
            textTransform: "capitalize",
            textAlign: "center",
            color: "white",
        },
        tabButtonTextFocused: {
            fontWeight: "bold",
        },
        waveImageStyle: {
            position: "absolute",
            bottom: 0,
            padding: 0,
            margin: 0,
            maxWidth: "100%",
            width: "100%",
            height: 200,
        },*/
        /*appTitle: {
            fontSize: 16,
            color: theme.textInverted,
            letterSpacing: 2,
            marginBottom: 70,
            ...styleTextThin,
        },*/
    });
});

export default withSafeAreaInsets(withTheme(TabBarComponent));
