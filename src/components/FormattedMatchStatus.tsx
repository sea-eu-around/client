import * as React from "react";
import {StyleProp, Text, TextStyle, View, ViewStyle, StyleSheet} from "react-native";
import i18n from "i18n-js";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {MatchActionStatus} from "../api/dto";
import {preTheme} from "../styles/utils";
import {MaterialIcons} from "@expo/vector-icons";

// Component props
export type FormattedMatchStatusProps = {
    status: MatchActionStatus;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    iconStyle?: StyleProp<TextStyle>;
} & ThemeProps;

class FormattedMatchStatus extends React.Component<FormattedMatchStatusProps> {
    render(): JSX.Element {
        const {status, theme, containerStyle, textStyle, iconStyle} = this.props;
        const styles = themedStyles(theme);

        const text = i18n.t(`matching.history.status.${status}`);

        let IconComponent;
        let iconName;

        switch (status) {
            case MatchActionStatus.Blocked:
                IconComponent = MaterialIcons;
                iconName = "block";
                break;
            case MatchActionStatus.Declined:
                IconComponent = MaterialIcons;
                iconName = "thumb-down";
                break;
            case MatchActionStatus.Matched:
                IconComponent = MaterialIcons;
                iconName = "people";
                break;
            case MatchActionStatus.Requested:
                IconComponent = MaterialIcons;
                iconName = "thumb-up";
                break;
        }

        return (
            <View style={[styles.container, containerStyle]}>
                <IconComponent style={[styles.icon, iconStyle]} name={iconName} />
                <Text style={[styles.text, textStyle]}>{text}</Text>
            </View>
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
        },
        icon: {
            marginRight: 5,
            paddingTop: 2,
        },
        text: {
            fontSize: 20,
        },
    });
});

export default withTheme(FormattedMatchStatus);
