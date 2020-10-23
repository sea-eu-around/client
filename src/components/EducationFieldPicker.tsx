import * as React from "react";

import {View, ViewProps, ViewStyle} from "react-native";
import {EDUCATION_FIELDS} from "../constants/profile-constants";
import i18n from "i18n-js";
import DropDownPicker from "react-native-dropdown-picker";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import themes from "../constants/themes";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
}));

// Component props
export type EducationFieldPickerProps = ConnectedProps<typeof reduxConnector> & {
    fields: string[];
    onChange?: (fields: string[]) => void;
} & ViewProps;

type PickerItem = {
    value: string;
    label: string;
};

class EducationFieldPicker extends React.Component<EducationFieldPickerProps> {
    static defaultProps = {
        fields: [],
    };

    render(): JSX.Element {
        const {theme, fields, onChange, ...viewProps} = this.props;

        const items = EDUCATION_FIELDS.map((field: string) => ({
            value: field,
            label: i18n.t(`educationFields.${field}`),
        }));

        const styleRelatedProps = {
            containerStyle: {height: 50},
            style: {
                backgroundColor: "#fafafa",
            },
            itemStyle: {justifyContent: "flex-start"} as ViewStyle,
            //activeItemStyle: {backgroundColor: "red"},
            activeLabelStyle: {color: theme.accentSecondary},
            labelStyle: {fontSize: 16},
            dropDownMaxHeight: 300,
            arrowSize: 20,
        };

        return (
            <View {...viewProps}>
                <DropDownPicker
                    items={items}
                    multiple={true}
                    searchable={true}
                    defaultValue={fields}
                    onChangeItem={(items: PickerItem[]) => {
                        if (onChange) onChange(items.map((it: PickerItem) => it.value));
                    }}
                    placeholder={i18n.t("educationFieldsPicker.placeholder")}
                    multipleText={i18n.t("educationFieldsPicker.multiple")}
                    searchablePlaceholder={i18n.t("educationFieldsPicker.searchPlaceholder")}
                    {...styleRelatedProps}
                />
                <View>{/*this.multiSelect ? this.multiSelect!.getSelectedItemsExt(selectedItems) : */ []}</View>
            </View>
        );
    }
}

export default reduxConnector(EducationFieldPicker);
