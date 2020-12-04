import * as React from "react";
import {StyleProp, Text, TextStyle, View, ViewStyle} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {withTheme} from "react-native-elements";
import {StackHeaderProps} from "@react-navigation/stack";
import {AppState} from "../../state/types";
import {ThemeProps} from "../../types";
import ProfileAvatar from "../ProfileAvatar";
import {headerTitle, rootNavigate} from "../../navigation/utils";
import {NavigatorRoute} from "../../navigation/types";
import {headerStyles} from "../../styles/headers";

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
};

// Component props
export type MainHeaderProps = ConnectedProps<typeof reduxConnector> & ThemeProps & StackHeaderProps & AdditionalProps;

// Component state

class MainHeaderClass extends React.Component<MainHeaderProps> {
    pressAvatar(): void {
        rootNavigate("MyProfileScreen");
    }

    render(): JSX.Element {
        const {theme, rightButtons, wrapperStyle, user, insets, scene} = this.props;
        const styles = headerStyles(theme);

        const title = headerTitle(scene.route.name as NavigatorRoute);

        return (
            <View style={[{paddingTop: insets.top}, styles.wrapper, wrapperStyle]}>
                <View style={styles.container}>
                    <ProfileAvatar
                        profile={user?.profile}
                        rounded
                        size={40}
                        avatarStyle={styles.avatar}
                        activeOpacity={0.75}
                        onPress={() => this.pressAvatar()}
                    />
                    <Text style={[styles.title, {marginLeft: 12}]} numberOfLines={1}>
                        {title}
                    </Text>
                    {rightButtons?.map((ButtonComponent, i) => (
                        <ButtonComponent
                            key={`header-button-${scene.route.key}-${i}`}
                            buttonStyle={styles.rightButton}
                            iconStyle={styles.rightIcon}
                        />
                    ))}
                </View>
            </View>
        );
    }
}

const MainHeaderComp = reduxConnector(withTheme(MainHeaderClass));

export default function MainHeader(props: StackHeaderProps & AdditionalProps): JSX.Element {
    return <MainHeaderComp {...props} />;
}
