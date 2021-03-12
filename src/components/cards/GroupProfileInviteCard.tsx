import * as React from "react";
import {StyleSheet, Text, View, StyleProp, ViewStyle, TouchableOpacity} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {Group} from "../../model/groups";
import EnlargeableAvatar from "../EnlargeableAvatar";
import {MaterialIcons} from "@expo/vector-icons";
import {navigateToProfile} from "../../navigation/utils";
import Button from "../Button";
import {UserProfile} from "../../model/user-profile";
import GroupInviteModal from "../modals/GroupInviteModal";
import store from "../../state/store";

// Component props
type GroupProfileInviteCardProps = {
    group: Group;
    profile: UserProfile;
    style?: StyleProp<ViewStyle>;
} & ThemeProps;

class GroupProfileInviteCard extends React.Component<GroupProfileInviteCardProps> {
    render(): JSX.Element {
        const {theme, group, profile, style, ...otherProps} = this.props;

        const styles = themedStyles(theme);

        return (
            <TouchableOpacity
                style={[styles.container, style]}
                onPress={() => navigateToProfile(profile.id, store.getState())}
                {...otherProps}
            >
                <EnlargeableAvatar profile={profile} size={50} rounded containerStyle={styles.avatarContainer} />
                <View style={{flexDirection: "column", flex: 1}}>
                    <Text style={styles.name} numberOfLines={2}>
                        {profile.firstName} {profile.lastName}
                    </Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <GroupInviteModal
                        activator={(show) => (
                            <Button
                                style={styles.controlButton}
                                icon={
                                    <MaterialIcons
                                        name="person-add"
                                        style={[styles.controlIcon, {color: theme.accent}]}
                                    />
                                }
                                onPress={show}
                            />
                        )}
                        group={group}
                        profile={profile}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            backgroundColor: theme.cardBackground,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
        },
        avatarContainer: {
            marginRight: 10,
            backgroundColor: theme.accentSecondary,
        },
        name: {
            color: theme.text,
            fontSize: 16,
        },
        controlButton: {
            padding: 6,
        },
        controlIcon: {
            color: theme.textLight,
            fontSize: 24,
        },
    });
});

export default withTheme(GroupProfileInviteCard);
