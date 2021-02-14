import * as React from "react";
import {TouchableOpacity, StyleSheet, Text, View} from "react-native";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import EnlargeableAvatar from "./EnlargeableAvatar";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {rootNavigate} from "../navigation/utils";
import {UserProfile} from "../model/user-profile";

// TODO clean-up
const reduxConnector = connect((state: AppState) => ({
    localUser: state.profile.user,
}));

// Component props
type PostHeaderProps = {
    profile: UserProfile | null;
    subtitle?: string | null;
} & ThemeProps &
    ConnectedProps<typeof reduxConnector>;

class PostHeader extends React.Component<PostHeaderProps> {
    render(): JSX.Element {
        const {profile, subtitle, theme} = this.props;

        const styles = themedStyles(theme);
        // const fromLocal = profile && localUser && profile.id === localUser.id;
        const name = profile ? `${profile.firstName} ${profile.lastName}` : "";

        return (
            <View style={styles.container}>
                <EnlargeableAvatar
                    profile={profile || undefined}
                    size={42}
                    containerStyle={styles.avatarContainer}
                    rounded
                />
                <View>
                    <TouchableOpacity onPress={() => profile && rootNavigate("ProfileScreen", {id: profile.id})}>
                        <Text style={styles.name}>{name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
        },
        avatarContainer: {
            width: 40,
            height: 40,
            backgroundColor: theme.accentSlight,
            marginRight: 10,
        },
        name: {
            fontSize: 18,
            color: theme.text,
        },
        subtitle: {
            fontSize: 13,
            color: theme.textLight,
        },
    });
});

export default reduxConnector(withTheme(PostHeader));
