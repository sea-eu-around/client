import * as React from "react";
import i18n from "i18n-js";
import {StyleProp, StyleSheet, TextStyle, ViewStyle} from "react-native";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import PopUpSelector from "./PopUpSelector";
import {SupportedLocale, SUPPORTED_LOCALES} from "../localization";
import {PickerButtonStyleVariant} from "../styles/picker";

// Component props
export type LocalePickerProps = {
    locale?: SupportedLocale;
    onChange?: (locale: SupportedLocale) => void;
    buttonStyle?: StyleProp<ViewStyle>;
    valueStyle?: StyleProp<TextStyle>;
    buttonStyleVariant?: PickerButtonStyleVariant;
} & ThemeProps;

class LocalePicker extends React.Component<LocalePickerProps> {
    render(): JSX.Element {
        const {onChange, locale, theme, buttonStyle, valueStyle, buttonStyleVariant} = this.props;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const styles = themedStyles(theme);

        return (
            <PopUpSelector
                values={SUPPORTED_LOCALES}
                label={(l: string) => i18n.t(`locales.${l}`)}
                selected={locale ? [locale] : []}
                valueStyle={valueStyle}
                buttonStyle={buttonStyle}
                buttonStyleVariant={buttonStyleVariant}
                onSelect={(values: string[]) => {
                    if (values.length > 0 && onChange) onChange(values[0] as SupportedLocale);
                }}
                noOkUnderline
            />
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({});
});

export default withTheme(LocalePicker);
