import * as React from "react";
import {TouchableOpacity, StyleSheet, Text, View} from "react-native";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import EnlargeableAvatar from "./EnlargeableAvatar";
import {navigateToGroup, rootNavigate} from "../navigation/utils";
import {UserProfile} from "../model/user-profile";
import {Group} from "../model/groups";
import Button from "./Button";
import {MaterialCommunityIcons} from "@expo/vector-icons";

// Component props
type PostHeaderProps = {
    profile: UserProfile | null;
    subtitle?: string | null;
    group: Group | null;
    showGroup?: boolean;
    openPostMenu?: () => void;
} & ThemeProps;

class PostHeader extends React.Component<PostHeaderProps> {
    render(): JSX.Element {
        const {profile, subtitle, showGroup, group, openPostMenu, theme} = this.props;

        const styles = themedStyles(theme);
        // const fromLocal = profile && localUser && profile.id === localUser.id;
        const name = profile ? `${profile.firstName} ${profile.lastName}` : "";

        return (
            <View style={styles.container}>
                <View style={styles.left}>
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
                        {showGroup && group && (
                            <TouchableOpacity onPress={() => navigateToGroup(group.id)}>
                                <Text style={styles.subtitle}>{group.name}</Text>
                            </TouchableOpacity>
                        )}
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    </View>
                </View>
                <Button
                    style={styles.menuButton}
                    icon={<MaterialCommunityIcons name="dots-horizontal" style={styles.menuButtonIcon} />}
                    onPress={openPostMenu}
                />
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
        },
        left: {
            flexDirection: "row",
        },
        avatarContainer: {
            width: 40,
            height: 40,
            backgroundColor: theme.accentSlight,
            marginRight: 10,
        },
        name: {
            fontSize: 16,
            color: theme.text,
        },
        subtitle: {
            fontSize: 13,
            color: theme.textLight,
        },
        menuButton: {
            paddingHorizontal: 10,
            paddingBottom: 10,
        },
        menuButtonIcon: {
            fontSize: 24,
            color: theme.textLight,
        },
    });
});

export default withTheme(PostHeader);
