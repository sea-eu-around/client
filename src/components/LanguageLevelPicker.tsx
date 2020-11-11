import * as React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {View, ViewProps, StyleSheet} from "react-native";
import {LanguageLevel, LANGUAGE_LEVELS} from "../constants/profile-constants";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {SupportedLocale} from "../localization";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    locale: state.settings.locale,
}));

// Component props
export type LanguageLevelPickerProps = {
    level: LanguageLevel;
    onChange?: (level: LanguageLevel) => void;
} & ViewProps &
    ThemeProps &
    ConnectedProps<typeof reduxConnector>;

type PickerItem = {
    value: LanguageLevel;
    label: string;
};

const items: Map<SupportedLocale, PickerItem[]> = new Map();

function updateItems(locale: SupportedLocale) {
    if (!items.has(locale)) {
        items.set(
            locale,
            LANGUAGE_LEVELS.map((code: LanguageLevel) => ({
                label: i18n.t(`languageLevels.${code}`),
                value: code,
            })),
        );
    }
}

class LanguageLevelPicker extends React.Component<LanguageLevelPickerProps> {
    constructor(props: LanguageLevelPickerProps) {
        super(props);
        updateItems(this.props.locale);
    }

    componentDidUpdate(oldProps: LanguageLevelPickerProps) {
        const locale = this.props.locale;
        if (oldProps.locale != locale) updateItems(locale);
    }

    render(): JSX.Element {
        const {onChange, locale, level, theme, ...viewProps} = this.props;
        const styles = themedStyles(theme);

        return (
            <View {...viewProps}>
                <DropDownPicker
                    items={items.get(locale) || []}
                    defaultValue={level}
                    multiple={false}
                    searchable={false}
                    placeholder={i18n.t("languageLevelPicker.placeholder")}
                    onChangeItem={(item: PickerItem) => {
                        if (onChange) onChange(item.value);
                    }}
                    style={styles.picker}
                    containerStyle={styles.pickerContainer}
                    itemStyle={styles.pickerItem}
                    labelStyle={styles.pickerLabel}
                    dropDownMaxHeight={300}
                    arrowSize={20}
                ></DropDownPicker>
            </View>
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        picker: {
            backgroundColor: "#fafafa",
            // just setting borderRadius won't work.
            // See https://github.com/hossein-zare/react-native-dropdown-picker#borderradius
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        },
        pickerContainer: {maxWidth: 120, height: 50, borderRadius: 0},
        pickerItem: {justifyContent: "flex-start"},
        pickerLabel: {fontSize: 16},
    });
});

export default reduxConnector(withTheme(LanguageLevelPicker));
