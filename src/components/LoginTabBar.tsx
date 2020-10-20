import React from "react";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {connect, ConnectedProps} from "react-redux";
import {MaterialTopTabBarProps} from "@react-navigation/material-top-tabs";
import {StyleSheet, View, Text} from "react-native";
import i18n from "i18n-js";
import Animated from "react-native-reanimated";
import {TouchableOpacity} from "react-native-gesture-handler";

// Map props from store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
type LoginTabBarProps = ConnectedProps<typeof reduxConnector> & MaterialTopTabBarProps;

function TabBarComponent({state, descriptors, navigation, position, theme}: LoginTabBarProps) {
    const styles = StyleSheet.create({
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
        waveImageStyle: {
            position: "absolute",
            bottom: 0,
            padding: 0,
            margin: 0,
            maxWidth: "100%",
            width: "100%",
            height: 200,
        },
    });

    // <Image source={waveImage} resizeMode="contain" style={styles.waveImageStyle} />
    return (
        <View style={styles.tabBarWrapper}>
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const {options} = descriptors[route.key];
                    const label = i18n.t(route.name.toLowerCase());
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key,
                        });
                    };

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
                                onPress={onPress}
                                onLongPress={onLongPress}
                            >
                                <Text style={[styles.tabButtonText, {fontWeight: isFocused ? "bold" : "normal"}]}>
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

export default reduxConnector(TabBarComponent);
