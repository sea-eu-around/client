import * as React from "react";
import {StyleProp, TextStyle, View, ViewStyle, StyleSheet} from "react-native";
import i18n from "i18n-js";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {OfferCategory} from "../api/dto";
import {preTheme} from "../styles/utils";
import {SvgProps} from "react-native-svg";
import SemiHighlightedText from "./SemiHighlightedText";
import OfferCategoryIcon from "./OfferCategoryIcon";

// Component props
export type FormattedOfferCategoryProps = {
    category: OfferCategory;
    containerStyle?: StyleProp<ViewStyle>;
    iconProps?: Partial<SvgProps>;
    textStyle?: StyleProp<TextStyle>;
    iconSize?: number;
    fontSize?: number;
    withoutIcon?: boolean;
} & ThemeProps;

class FormattedOfferCategory extends React.Component<FormattedOfferCategoryProps> {
    render(): JSX.Element {
        const {containerStyle, category, theme, textStyle, iconProps, iconSize, fontSize, withoutIcon} = this.props;
        const styles = themedStyles(theme);

        const translationKey = `onboarding.offers${category[0].toUpperCase() + category.slice(1)}.title`;

        const size = iconSize || 75;

        return (
            <View style={[styles.container, containerStyle]}>
                {!withoutIcon && <OfferCategoryIcon category={category} size={size} {...iconProps} />}
                <SemiHighlightedText text={i18n.t(translationKey)} textStyle={textStyle} fontSize={fontSize} />
            </View>
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            marginLeft: -10,
        },
    });
});

export default withTheme(FormattedOfferCategory);
