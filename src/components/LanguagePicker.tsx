import * as React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {View, ViewProps, StyleSheet} from "react-native";
import {ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    languageItems: state.settings.localizedLanguageItems,
}));

// Component props
export type LanguagePickerProps = ConnectedProps<typeof reduxConnector> & {
    languages: string[];
    single: boolean;
    onChange?: (languages: string[]) => void;
} & ViewProps &
    ThemeProps;

type PickerItem = {
    value: string;
    label: string;
};

class LanguagePicker extends React.Component<LanguagePickerProps> {
    static defaultProps = {
        languages: [],
    };

    render(): JSX.Element {
        const {onChange, languageItems, single, languages, theme, ...viewProps} = this.props;
        const styles = themedStyles(theme);

        return (
            <View {...viewProps}>
                <DropDownPicker
                    items={languageItems}
                    multiple={!single}
                    searchable={true}
                    placeholder={i18n.t(`languagePicker.placeholder${single ? "Single" : "Multiple"}`)}
                    searchablePlaceholder={i18n.t("languagePicker.searchPlaceholder")}
                    onChangeItem={(items: PickerItem | PickerItem[]) => {
                        const languages = (Array.isArray(items) ? items : [items]).map((it: PickerItem) => it.value);
                        if (onChange) onChange(languages);
                    }}
                    defaultValue={single ? languages[0] : languages}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    labelStyle={styles.pickerLabel}
                    containerStyle={styles.containerStyle}
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
        containerStyle: {height: 50},
        pickerItem: {justifyContent: "flex-start"},
        pickerLabel: {fontSize: 16},
    });
});

export default reduxConnector(withTheme(LanguagePicker));
