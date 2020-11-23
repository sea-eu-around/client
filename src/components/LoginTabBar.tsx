import React from "react";
import {MaterialTopTabBarProps} from "@react-navigation/material-top-tabs";
import {View, Text, StyleSheet} from "react-native";
import i18n from "i18n-js";
import Animated from "react-native-reanimated";
import {TouchableOpacity} from "react-native-gesture-handler";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";

// Component props
type LoginTabBarProps = ThemeProps & MaterialTopTabBarProps;

class TabBarComponent extends React.Component<LoginTabBarProps> {
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

        // <Image source={waveImage} resizeMode="contain" style={styles.waveImageStyle} />
        return (
            <View style={styles.tabBarWrapper}>
                {/*<Text style={styles.appTitle}>SEA-EU Around</Text>*/}
                <View style={styles.tabBar}>
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
                </View>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        tabBarWrapper: {
            height: "30%",
            backgroundColor: theme.accent,
            alignItems: "center",
            justifyContent: "flex-end",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,
            elevation: 12,
        },
        tabBar: {
            width: "100%",
            maxWidth: 400,
            height: 40,
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
            lineHeight: 40,
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
        },
        /*appTitle: {
            fontSize: 16,
            color: theme.textInverted,
            letterSpacing: 2,
            marginBottom: 70,
            ...styleTextThin,
        },*/
    });
});

export default withTheme(TabBarComponent);