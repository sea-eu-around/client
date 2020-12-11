import * as React from "react";
import i18n from "i18n-js";
import {StyleProp, StyleSheet, TextStyle, ViewStyle} from "react-native";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import PopUpSelector from "./PopUpSelector";
import {SupportedLocale, SUPPORTED_LOCALES} from "../localization";

// Component props
export type LocalePickerProps = {
    locale?: SupportedLocale;
    onChange?: (locale: SupportedLocale) => void;
    buttonStyle?: StyleProp<ViewStyle>;
    valueStyle?: StyleProp<TextStyle>;
} & ThemeProps;

class LocalePicker extends React.Component<LocalePickerProps> {
    render(): JSX.Element {
        const {onChange, locale, theme, buttonStyle, valueStyle} = this.props;
        const styles = themedStyles(theme);

        return (
            <PopUpSelector
                values={SUPPORTED_LOCALES}
                label={(l: string) => i18n.t(`locales.${l}`)}
                selected={locale ? [locale] : []}
                valueStyle={[styles.value, valueStyle]}
                buttonStyle={buttonStyle}
                onSelect={(values: string[]) => {
                    if (values.length > 0 && onChange) onChange(values[0] as SupportedLocale);
                }}
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        value: {
            letterSpacing: 0.5,
            fontSize: 16,
            color: theme.text,
        },
    });
});

export default withTheme(LocalePicker);
