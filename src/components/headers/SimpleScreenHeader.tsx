import * as React from "react";
import {Text, TouchableOpacity, View, StyleProp, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";
import {StackHeaderProps} from "@react-navigation/stack";
import {MaterialIcons} from "@expo/vector-icons";
import {headerStyles} from "../../styles/headers";
import {headerTitle} from "../../navigation/utils";
import {NavigatorRoute} from "../../navigation/types";

// Component props
export type SimpleHeaderProps = {
    wrapperStyle?: StyleProp<ViewStyle>;
    color?: string;
    noShadow?: boolean;
} & ThemeProps &
    StackHeaderProps;

class SimpleHeader extends React.Component<SimpleHeaderProps> {
    back() {
        const nav = this.props.navigation;
        if (nav.canGoBack()) nav.goBack();
    }

    render(): JSX.Element {
        const {theme, insets, scene, wrapperStyle, noShadow, color} = this.props;
        const hstyles = headerStyles(theme);

        const title = headerTitle(scene.route.name as NavigatorRoute);
        const colorStyle = color ? {color} : {};

        return (
            <View
                style={[
                    {paddingTop: insets.top},
                    hstyles.wrapper,
                    noShadow ? hstyles.wrapperNoShadow : {},
                    wrapperStyle,
                ]}
            >
                <View style={hstyles.container}>
                    <TouchableOpacity style={hstyles.backButton} onPress={() => this.back()}>
                        <MaterialIcons style={[hstyles.backButtonIcon, colorStyle]} name="arrow-back" />
                    </TouchableOpacity>
                    <Text style={[hstyles.title, colorStyle]} numberOfLines={1}>
                        {title}
                    </Text>
                </View>
            </View>
        );
    }
}

export default withTheme(SimpleHeader);
