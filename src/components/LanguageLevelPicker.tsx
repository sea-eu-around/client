import * as React from "react";
import i18n from "i18n-js";
import {StyleProp, StyleSheet, ViewStyle} from "react-native";
import {LanguageLevel, LANGUAGE_LEVELS} from "../constants/profile-constants";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import PopUpSelector from "./PopUpSelector";

// Component props
export type LanguageLevelPickerProps = {
    level?: LanguageLevel;
    onChange?: (level: LanguageLevel) => void;
    buttonStyle?: StyleProp<ViewStyle>;
} & ThemeProps;

class LanguageLevelPicker extends React.Component<LanguageLevelPickerProps> {
    render(): JSX.Element {
        const {onChange, level, theme, buttonStyle} = this.props;
        const styles = themedStyles(theme);

        return (
            <PopUpSelector
                values={LANGUAGE_LEVELS}
                label={(l: string) => i18n.t(`languageLevels.${l}`)}
                placeholder={i18n.t("languageLevelPicker.placeholder")}
                selected={level ? [level] : []}
                valueStyle={styles.value}
                buttonStyle={[styles.button, buttonStyle]}
                onSelect={(values: string[]) => {
                    if (values.length > 0 && onChange) onChange(values[0] as LanguageLevel);
                }}
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        button: {
            width: 70,
            height: 32,
            alignItems: "center",
        },
        value: {
            letterSpacing: 0.5,
            fontSize: 14,
            color: theme.text,
        },
    });
});

export default withTheme(LanguageLevelPicker);
