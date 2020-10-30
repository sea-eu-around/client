import * as React from "react";
import {EDUCATION_FIELDS} from "../constants/profile-constants";
import i18n from "i18n-js";
import MultiPicker from "./MultiPicker";

// Component props
export type EducationFieldPickerProps = {
    fields?: string[];
    onChange?: (fields: string[]) => void;
};

class EducationFieldPicker extends React.Component<EducationFieldPickerProps> {
    static defaultProps = {
        fields: [],
    };

    render(): JSX.Element {
        const {fields, onChange} = this.props;

        return (
            <MultiPicker
                values={EDUCATION_FIELDS}
                genLabel={(field: string) => `educationFields.${field}`}
                defaultValues={fields}
                onChange={(values: string[]) => {
                    if (onChange) onChange(values);
                }}
                placeholder={i18n.t("educationFieldsPicker.placeholder")}
                multipleText={i18n.t("educationFieldsPicker.multiple")}
                searchablePlaceholder={i18n.t("educationFieldsPicker.searchPlaceholder")}
            />
        );
    }
}

export default EducationFieldPicker;
