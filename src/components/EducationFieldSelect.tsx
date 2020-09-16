import * as React from "react";

import {Text, View} from "react-native";
import MultiSelect from "react-native-multiple-select";
import {EDUCATION_FIELDS} from "../constants/profile-constants";
import i18n from "i18n-js";


export class EducationFieldSelect extends React.Component {
    state = {
        selectedItems: [] as string[],
    };

    onSelectedItemsChange = (selectedItems: string[]): void => {
        this.setState({selectedItems});
    };

    multiSelect: MultiSelect | null = null;

    render(): JSX.Element {
        const items = EDUCATION_FIELDS.map((field: string) => ({
            id: field,
            name: i18n.t(`educationFields.${field}`),
        }));
        const styleProps = {
            tagRemoveIconColor: "#CCC",
            tagBorderColor: "#CCC",
            tagTextColor: "#CCC",
            selectedItemTextColor: "#CCC",
            selectedItemIconColor: "#CCC",
            itemTextColor: "#000",
            submitButtonColor: "#444",
            searchInputStyle: {color: "#CCC"},
            styleMainWrapper: {marginTop: 10},
        };

        const {selectedItems} = this.state;
        return (
            <View style={{flex: 1, width: "100%"}}>
                <Text>Education fields</Text>
                <MultiSelect
                    hideTags
                    items={items}
                    uniqueKey="id"
                    displayKey="name"
                    ref={(component) => {
                        this.multiSelect = component;
                    }}
                    onSelectedItemsChange={this.onSelectedItemsChange}
                    selectedItems={selectedItems}
                    selectText="Select fields"
                    searchInputPlaceholderText={i18n.t("search")}
                    submitButtonText="Validate"
                    onChangeInput={(text) => console.log(text)}
                    fixedHeight={true}
                    {...styleProps}
                />
                <View>{/*this.multiSelect ? this.multiSelect!.getSelectedItemsExt(selectedItems) : */[]}</View>

            </View>
        );
    }
}
