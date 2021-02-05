import * as React from "react";
import {TouchableOpacity, TouchableOpacityProps, StyleSheet, Text} from "react-native";
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
                style={[styles.container, style]}
                activeOpacity={0.9}
                onPress={() => {
                    rootNavigate("TabGroups", {screen: "GroupScreen", params: group ? {groupId: group.id} : {}});
                }}
                {...otherProps}
            >
                {group && (
                    <Text style={styles.groupName} numberOfLines={2}>
                        {group?.name}
                    </Text>
                )}
            </TouchableOpacity>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: 80,
            height: 80,
            backgroundColor: theme.accentSlight,
            borderRadius: 10,
            marginRight: 10,
            padding: 5,
        },
        groupName: {
            color: theme.text,
        },
    });
});

export default withTheme(MyGroupCard);
