import * as React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {View, ViewProps, ViewStyle} from "react-native";
import {LANGUAGE_LEVELS} from "../constants/profile-constants";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
    stateLocale: state.settings.locale,
}));

// Component props
export type LanguageLevelPickerProps = ConnectedProps<typeof reduxConnector> & {
    level: string;
    onChange?: (level: string) => void;
} & ViewProps;

type PickerItem = {
    value: string;
    label: string;
};

let items: PickerItem[];

function updateItems() {
    items = LANGUAGE_LEVELS.map((code: string) => ({
        label: i18n.t(`languageLevels.${code}`),
        value: code,
    }));
}

class LanguageLevelPicker extends React.Component<LanguageLevelPickerProps> {
    constructor(props: LanguageLevelPickerProps) {
        super(props);
        updateItems();
    }

    componentDidUpdate(oldProps: LanguageLevelPickerProps) {
        if (oldProps.stateLocale != this.props.stateLocale) updateItems();
    }

    render(): JSX.Element {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {onChange, level, ...viewProps} = this.props;

        const styleRelatedProps = {
            containerStyle: {maxWidth: 120, height: 50, borderRadius: 0},
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
                    defaultValue={this.props.level}
                    multiple={false}
                    searchable={false}
                    placeholder={i18n.t("languageLevelPicker.placeholder")}
                    onChangeItem={(item: PickerItem) => {
                        if (onChange) onChange(item.value);
                    }}
                    {...styleRelatedProps}
                ></DropDownPicker>
            </View>
        );
    }
}

export default reduxConnector(LanguageLevelPicker);
