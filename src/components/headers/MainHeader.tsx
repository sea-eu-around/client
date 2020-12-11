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

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    user: state.profile.user,
}));

export type HeaderButtonProps = {
    buttonStyle: StyleProp<ViewStyle>;
    iconStyle: StyleProp<TextStyle>;
};

type AdditionalProps = {
    wrapperStyle?: StyleProp<ViewStyle>;
    rightButtons?: ((props: HeaderButtonProps) => JSX.Element)[];
    backButton?: boolean;
    noSettingsButton?: boolean;
    noAvatar?: boolean;
    color?: string;
    noShadow?: boolean;
};

// Component props
export type MainHeaderProps = ConnectedProps<typeof reduxConnector> & ThemeProps & StackHeaderProps & AdditionalProps;

class MainHeaderClass extends React.Component<MainHeaderProps> {
    back(): void {
        navigateBack();
    }

    pressAvatar(): void {
        rootNavigate("MyProfileScreen");
    }

    render(): JSX.Element {
        const {
            theme,
            backButton,
            rightButtons,
            wrapperStyle,
            color,
            noShadow,
            noSettingsButton,
            noAvatar,
            user,
            insets,
            scene,
        } = this.props;
        const styles = headerStyles(theme);

        const title = headerTitle(scene.route.name as NavigatorRoute);

        return (
            <View
                style={[{paddingTop: insets.top}, styles.wrapper, noShadow ? styles.wrapperNoShadow : {}, wrapperStyle]}
            >
                <View style={styles.container}>
                    {backButton && (
                        <TouchableOpacity style={styles.backButton} onPress={() => this.back()}>
                            <MaterialIcons
                                style={[styles.backButtonIcon, {color: color || theme.text}]}
                                name="arrow-back"
                            />
                        </TouchableOpacity>
                    )}
                    {!noAvatar && (
                        <ProfileAvatar
                            profile={user?.profile}
                            rounded
                            size={40}
                            containerStyle={styles.avatarContainer}
                            titleStyle={styles.avatarTitle}
                            activeOpacity={0.75}
                            onPress={() => this.pressAvatar()}
                        />
                    )}
                    <Text style={[styles.title, {marginLeft: 12, color: color || theme.text}]} numberOfLines={1}>
                        {title}
                    </Text>
                    {rightButtons?.map((ButtonComponent, i) => (
                        <ButtonComponent
                            key={`header-button-${scene.route.key}-${i}`}
                            buttonStyle={styles.rightButton}
                            iconStyle={styles.rightIcon}
                        />
                    ))}
                    {!noSettingsButton && (
                        <TouchableOpacity style={styles.rightButton} onPress={() => rootNavigate("SettingsScreen")}>
                            <MaterialIcons name="settings" style={styles.rightIcon} color={color || theme.text} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }
}

const MainHeaderComp = reduxConnector(withTheme(MainHeaderClass));

export default function MainHeader(props: StackHeaderProps & AdditionalProps): JSX.Element {
    return <MainHeaderComp {...props} />;
}
