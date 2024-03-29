import * as React from "react";
import {StyleSheet, Platform} from "react-native";
import {BottomTabBar, BottomTabBarProps} from "@react-navigation/bottom-tabs";
import {BlurView} from "expo-blur";
import {ThemeProps} from "../../types";
import {ThemeConsumer} from "react-native-elements";
import {useSafeAreaInsets, EdgeInsets} from "react-native-safe-area-context";
import {MaterialIcons} from "@expo/vector-icons";
import {preTheme} from "../../styles/utils";
import {BLUR_TAB_INTENSITY} from "../../styles/general";

// Component props
export type MainTabBarProps = ThemeProps & BottomTabBarProps & {insets: EdgeInsets};

class MainTabBarClass extends React.Component<MainTabBarProps> {
    render(): JSX.Element {
        const {
            theme,
            insets: {bottom},
            ...tabBarProps
        } = this.props;
        const styles = themedStyles(theme);

        return (
            <BlurView
                style={styles.blurViewStyle}
                tint={theme.id === "dark" ? "dark" : "default"}
                intensity={BLUR_TAB_INTENSITY}
            >
                <BottomTabBar
                    {...tabBarProps}
                    activeTintColor={theme.accent}
                    style={[styles.tabBar, {paddingBottom: bottom}]}
                    tabStyle={styles.tab}
                    iconStyle={styles.icon}
                    showLabel={false}
                />
            </BlurView>
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        blurViewStyle:
            Platform.OS === "web"
                ? {} // On web, scrolling on certain pages breaks if the tab bar is position absolutely
                : {
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                  },
        tabBar: {
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: "transparent",
        },
        tab: {
            flexDirection: "column",
            justifyContent: "center",
        },
        icon: {
            flex: 1,
        },
    });
});

function MainTabBar(props: BottomTabBarProps): JSX.Element {
    const insets = useSafeAreaInsets();
    return (
        <ThemeConsumer>
            {(themeProps: ThemeProps) => <MainTabBarClass insets={insets} {...themeProps} {...props} />}
        </ThemeConsumer>
    );
}

export type MainTabBarIconProps = {
    focused: boolean;
    color: string;
    size: number;
};
export function MainTabBarIcon({name, color}: {name: string} & MainTabBarIconProps): JSX.Element {
    return <MaterialIcons size={26} name={name} color={color} />;
}

export default MainTabBar;
