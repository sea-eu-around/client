import * as React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {LANGUAGES_CODES} from "../model/languages";
import {View, ViewStyle} from "react-native";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
    stateLocale: state.settings.locale,
    // TODO on stateLocale change refresh items list
}));

// Component props
export type LanguagePickerProps = ConnectedProps<typeof reduxConnector> & {
    languages: string[];
    single: boolean;
    onChange?: (languages: string[]) => void;
};

// Component state
export type LanguagePickerState = {
    selectedCodes: string[];
};

type PickerItem = {
    value: string;
    label: string;
};

let items: PickerItem[];

class LanguagePicker extends React.Component<LanguagePickerProps, LanguagePickerState> {
    constructor(props: LanguagePickerProps) {
        super(props);
        this.state = {
            selectedCodes: props.languages,
        };
    }

    /*componentDidUpdate(oldProps: LanguagePickerProps) {
        if (!oldProps.open && this.props.open) this.showModal();
        if (oldProps.open && !this.props.open) this.hideModal();
    }*/

    render(): JSX.Element {
        const {onChange, single} = this.props;

        // TODO Move to update
        const items = LANGUAGES_CODES.map((code: string) => ({
            label: i18n.t(`languageNames.${code}`),
            value: code,
        }));

        const styleRelatedProps = {
            containerStyle: {height: 50, borderRadius: 0},
            itemStyle: {justifyContent: "flex-start"} as ViewStyle,
            labelStyle: {fontSize: 16},
            style: {backgroundColor: "#fafafa"},
            dropDownMaxHeight: 300,
            arrowSize: 20,
        };

        return (
            <View>
                <DropDownPicker
                    items={items}
                    multiple={!single}
                    searchable={true}
                    placeholder={i18n.t(`languagePicker.placeholder${single ? "Single" : "Multiple"}`)}
                    //multipleText={i18n.t("languagePicker.multiple")}
                    searchablePlaceholder={i18n.t("languagePicker.searchPlaceholder")}
                    onChangeItem={(items: PickerItem | PickerItem[]) => {
                        const languages = (Array.isArray(items) ? items : [items]).map((it: PickerItem) => it.value);
                        this.setState({
                            ...this.state,
                            selectedCodes: languages,
                        });
                        if (onChange) onChange(languages);
                        console.log(languages);
                    }}
                    {...styleRelatedProps}
                    {...(single ? {} : {defaultValue: []})}
                ></DropDownPicker>
            </View>
        );
    }
}

export default reduxConnector(LanguagePicker);
