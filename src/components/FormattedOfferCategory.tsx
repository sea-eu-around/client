import * as React from "react";
import {StyleProp, Text, TextStyle, View, ViewStyle, StyleSheet} from "react-native";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {OfferCategory} from "../api/dto";
import {getLocalSvg} from "../assets";
import {preTheme} from "../styles/utils";
import {SvgProps} from "react-native-svg";

// Component props
export type FormattedOfferCategoryProps = {
    category: OfferCategory;
    containerStyle?: StyleProp<ViewStyle>;
    iconProps?: Partial<SvgProps>;
    textStyle?: StyleProp<TextStyle>;
    iconSize?: number;
} & ThemeProps;

class FormattedOfferCategory extends React.Component<FormattedOfferCategoryProps> {
    render(): JSX.Element {
        const {containerStyle, category, theme, textStyle, iconProps, iconSize} = this.props;
        const styles = themedStyles(theme);

        const translationKey = `onboarding.offers${category[0].toUpperCase() + category.slice(1)}.title`;
        const SvgIcon = getLocalSvg(`offers.categories.${category}`, () => this.forceUpdate());

        const size = iconSize || 75;

        return (
            <View style={[styles.container, containerStyle]}>
                <SvgIcon width={size} height={size} {...iconProps} />
                <View style={styles.textContainer}>
                    <View style={styles.underline} />
                    <Text style={[styles.text, textStyle]}>{i18n.t(translationKey)}</Text>
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
            marginLeft: -10,
        },
        textContainer: {
            alignItems: "center",
        },
        text: {
            fontSize: 24,
            fontFamily: "RalewaySemiBold",
            color: theme.accent,
            paddingHorizontal: 6,
            zIndex: 2,

            // Make it more readable with the dark theme
            ...(theme.id === "dark"
                ? {
                      textShadowColor: "rgba(0, 0, 0, 0.6)",
                      textShadowOffset: {width: 0, height: 1},
                      textShadowRadius: 1,
                  }
                : {}),
        },
        underline: {
            position: "absolute",
            bottom: 2,
            width: "100%",
            height: 12,
            backgroundColor: theme.accentTernary,
            zIndex: 1,
        },
    });
});

export default withTheme(FormattedOfferCategory);
