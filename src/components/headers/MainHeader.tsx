import * as React from "react";
import {StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {withTheme} from "react-native-elements";
import {StackHeaderProps} from "@react-navigation/stack";
import {AppState} from "../../state/types";
import {ThemeProps} from "../../types";
import ProfileAvatar from "../ProfileAvatar";
import {headerTitle, navigateBack, rootNavigate} from "../../navigation/utils";
import {NavigatorRoute} from "../../navigation/types";
import {headerStyles} from "../../styles/headers";
import {MaterialIcons} from "@expo/vector-icons";
import {BlurProps, BlurView} from "expo-blur";
import {useSafeAreaInsets, EdgeInsets} from "react-native-safe-area-context";
import {Route} from "@react-navigation/native";
import {BLUR_HEADER_INTENSITY} from "../../styles/general";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    user: state.profile.user,
}));

export type HeaderButtonProps = {
    buttonStyle: StyleProp<ViewStyle>;
    iconStyle: StyleProp<TextStyle>;
};

type AdditionalProps = {
    rightButtons?: ((props: HeaderButtonProps) => JSX.Element)[];
    backButton?: boolean;
    noAvatar?: boolean;
    noShadow?: boolean;
    noSettingsButton?: boolean;
    blur?: boolean;
    overrideAvatar?: JSX.Element;
    overrideTitle?: string;
    wrapperStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    color?: string;
    buttonBackgroundColor?: string;
};

export type MainHeaderStackProps = Partial<StackHeaderProps> & {route?: Route<string, undefined>};

// Component props
export type MainHeaderProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps & {insets: EdgeInsets} & MainHeaderStackProps &
    AdditionalProps;

class MainHeaderClass extends React.Component<MainHeaderProps> {
    back(): void {
        navigateBack("MainScreen");
    }

    render(): JSX.Element {
        const {
            theme,
            insets,
            user,
            rightButtons,
            backButton,
            noAvatar,
            noShadow,
            noSettingsButton,
            blur,
            overrideAvatar,
            overrideTitle,
            wrapperStyle,
            titleStyle,
            color,
        } = this.props;

        const styles = headerStyles(theme);

        const routeName = (this.props.route || this.props.scene?.route || {name: "undef"}).name;
        const title = headerTitle(routeName as NavigatorRoute);
        const textColor = color || theme.text;
        const buttonBackgroundColor = this.props.buttonBackgroundColor || theme.cardBackground;

        const WrapperComponent = blur ? BlurView : View;
        const blurProps: Partial<BlurProps> = blur
            ? {
                  tint: theme.id === "dark" ? "dark" : "default",
                  intensity: BLUR_HEADER_INTENSITY,
              }
            : {};

        return (
            <WrapperComponent
                style={[
                    {paddingTop: insets.top},
                    styles.wrapper,
                    blur ? styles.wrapperBlur : {},
                    noShadow ? styles.wrapperNoShadow : {},
                    wrapperStyle,
                ]}
                {...blurProps}
            >
                {backButton && (
                    <TouchableOpacity style={styles.backButton} onPress={() => this.back()}>
                        <MaterialIcons style={[styles.backButtonIcon, {color: textColor}]} name="arrow-back" />
                    </TouchableOpacity>
                )}
                {!noAvatar &&
                    (overrideAvatar || (
                        <ProfileAvatar
                            profile={user?.profile}
                            rounded
                            size={40}
                            containerStyle={styles.avatarContainer}
                            titleStyle={styles.avatarTitle}
                            activeOpacity={0.75}
                            onPress={() => rootNavigate("MyProfileScreen")}
                        />
                    ))}
                <Text style={[styles.title, {marginLeft: 12, color: textColor}, titleStyle]} numberOfLines={1}>
                    {overrideTitle || title}
                </Text>
                {rightButtons?.map((ButtonComponent, i) => (
                    <ButtonComponent
                        key={`header-button-${routeName.toLowerCase()}-${i}`}
                        buttonStyle={[styles.rightButton, {backgroundColor: buttonBackgroundColor}]}
                        iconStyle={[styles.rightIcon, {color: textColor}]}
                    />
                ))}
                {!noSettingsButton && (
                    <TouchableOpacity
                        style={[styles.rightButton, {backgroundColor: buttonBackgroundColor}]}
                        onPress={() => rootNavigate("SettingsScreen")}
                    >
                        <MaterialIcons name="settings" style={styles.rightIcon} color={textColor} />
                    </TouchableOpacity>
                )}
            </WrapperComponent>
        );
    }
}

const MainHeaderComp = reduxConnector(withTheme(MainHeaderClass));

export default function MainHeader(props: MainHeaderStackProps & AdditionalProps): JSX.Element {
    const insets = useSafeAreaInsets();
    return <MainHeaderComp insets={insets} {...props} />;
}
