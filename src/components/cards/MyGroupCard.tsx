import * as React from "react";
import {TouchableOpacity, TouchableOpacityProps, StyleSheet, Text, Image} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {Group} from "../../model/groups";
import {rootNavigate} from "../../navigation/utils";

// Component props
type MyGroupCardProps = {
    group: Group | null;
} & TouchableOpacityProps &
    ThemeProps;

class MyGroupCard extends React.Component<MyGroupCardProps> {
    render(): JSX.Element {
        const {group, theme, style, ...otherProps} = this.props;

        const styles = themedStyles(theme);

        return (
            <TouchableOpacity
                style={[styles.container, group && !group.cover ? styles.containerWithoutCover : {}, style]}
                activeOpacity={0.9}
                onPress={() => {
                    rootNavigate("TabGroups", {screen: "GroupScreen", params: group ? {groupId: group.id} : {}});
                }}
                {...otherProps}
            >
                {group && (
                    <>
                        {group.cover && (
                            <Image style={styles.groupCover} source={{uri: group.cover}} resizeMode="cover" />
                        )}
                        <Text
                            style={group.cover ? styles.groupNameWithCover : styles.groupNameWithoutCover}
                            numberOfLines={3}
                        >
                            {group?.name}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: 90,
            height: 90,
            borderRadius: 15,
            marginRight: 10,
            overflow: "hidden",
        },
        containerWithoutCover: {
            borderWidth: 1,
            borderColor: theme.componentBorder,
        },
        groupCover: {
            position: "absolute",
            width: "100%",
            height: "100%",
        },
        groupNameWithCover: {
            color: theme.textWhite,
            textShadowColor: "rgba(0, 0, 0, 0.75)",
            textShadowOffset: {width: 0, height: 1},
            textShadowRadius: 15,
            margin: 5,
        },
        groupNameWithoutCover: {
            color: theme.textLight,
            margin: 5,
        },
    });
});

export default withTheme(MyGroupCard);
