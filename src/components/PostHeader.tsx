import * as React from "react";
import {TouchableOpacity, StyleSheet, Text, View, Image} from "react-native";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import EnlargeableAvatar from "./EnlargeableAvatar";
import {navigateToGroup, rootNavigate} from "../navigation/utils";
import {UserProfile} from "../model/user-profile";
import {Group} from "../model/groups";
import Button from "./Button";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import LocalImage from "./LocalImage";
import {GroupMemberStatus} from "../api/dto";

// Component props
type PostHeaderProps = {
    profile: UserProfile | null;
    subtitle?: string | null;
    group: Group | null;
    isFeed?: boolean;
    openPostMenu?: () => void;
} & ThemeProps;

class PostHeader extends React.Component<PostHeaderProps> {
    render(): JSX.Element {
        const {profile, subtitle, isFeed, group, openPostMenu, theme} = this.props;

        const styles = themedStyles(theme);
        const profileName = profile ? `${profile.firstName} ${profile.lastName}` : "";
        const name = isFeed ? (group ? group.name : "") : profileName;

        const toGroup = () => group && group.myStatus === GroupMemberStatus.Approved && navigateToGroup(group.id);
        const toProfile = () => profile && rootNavigate("ProfileScreen", {id: profile.id});

        return (
            <View style={styles.container}>
                <View style={styles.left}>
                    {isFeed ? (
                        <TouchableOpacity onPress={toGroup}>
                            {group && group.cover && (
                                <Image style={styles.groupCover} source={{uri: group.cover}} resizeMode="cover" />
                            )}
                            {group && !group.cover && (
                                <LocalImage style={styles.groupCover} imageKey="group-placeholder" resizeMode="cover" />
                            )}
                        </TouchableOpacity>
                    ) : (
                        <EnlargeableAvatar
                            profile={profile || undefined}
                            size={40}
                            containerStyle={styles.avatarContainer}
                            rounded
                        />
                    )}

                    <View>
                        <TouchableOpacity onPress={isFeed ? toGroup : toProfile}>
                            <Text style={styles.name}>{name}</Text>
                        </TouchableOpacity>

                        {isFeed && (
                            <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}} onPress={toProfile}>
                                <EnlargeableAvatar
                                    profile={profile || undefined}
                                    size={20}
                                    containerStyle={styles.avatarContainerSmall}
                                    rounded
                                />
                                <Text style={styles.subtitle}>{profileName}</Text>
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
            alignItems: "center",
            flex: 1,
        },
        avatarContainer: {
            backgroundColor: theme.accentSlight,
            marginRight: 10,
        },
        avatarContainerSmall: {
            backgroundColor: theme.accentSlight,
            marginRight: 5,
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

        groupCover: {
            width: 45,
            height: 45,
            borderRadius: 45,
            marginRight: 10,
        },
    });
});

export default withTheme(PostHeader);
