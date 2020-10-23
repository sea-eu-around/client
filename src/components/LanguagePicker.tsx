import * as React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {LANGUAGES_CODES} from "../model/languages";
import {View, ViewProps, ViewStyle} from "react-native";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
    stateLocale: state.settings.locale,
}));

// Component props
export type LanguagePickerProps = ConnectedProps<typeof reduxConnector> & {
    languages: string[];
    single: boolean;
    onChange?: (languages: string[]) => void;
} & ViewProps;

type PickerItem = {
    value: string;
    label: string;
};

let items: PickerItem[];

function updateItems() {
    items = LANGUAGES_CODES.map((code: string) => ({
        label: i18n.t(`languageNames.${code}`),
        value: code,
    }));
}

class LanguagePicker extends React.Component<LanguagePickerProps> {
    constructor(props: LanguagePickerProps) {
        super(props);
        updateItems();
    }

    componentDidUpdate(oldProps: LanguagePickerProps) {
        if (oldProps.stateLocale != this.props.stateLocale) updateItems();
    }

    render(): JSX.Element {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {onChange, single, languages, ...viewProps} = this.props;

        const styleRelatedProps = {
            containerStyle: {height: 50},
            style: {
                backgroundColor: "#fafafa",
                // just setting borderRadius won't work.
                // See https://github.com/hossein-zare/react-native-dropdown-picker#borderradius
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
            },
            itemStyle: {justifyContent: "flex-start"} as ViewStyle,
            labelStyle: {fontSize: 16},
            dropDownMaxHeight: 300,
            arrowSize: 20,
        };

        return (
            <View {...viewProps}>
                <DropDownPicker
                    items={items}
                    multiple={!single}
                    searchable={true}
                    placeholder={i18n.t(`languagePicker.placeholder${single ? "Single" : "Multiple"}`)}
                    //multipleText={i18n.t("languagePicker.multiple")}
                    searchablePlaceholder={i18n.t("languagePicker.searchPlaceholder")}
                    onChangeItem={(items: PickerItem | PickerItem[]) => {
                        const languages = (Array.isArray(items) ? items : [items]).map((it: PickerItem) => it.value);
                        if (onChange) onChange(languages);
                    }}
                    defaultValue={single ? this.props.languages[0] : this.props.languages}
                    {...styleRelatedProps}
                ></DropDownPicker>
            </View>
        );
    }
}

export default reduxConnector(LanguagePicker);