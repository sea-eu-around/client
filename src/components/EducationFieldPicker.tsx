import * as React from "react";
import i18n from "i18n-js";
import {MultiPickerProps} from "./MultiPicker";
import SectionedMultiPicker from "./SectionedMultiPicker";
import {EDUCATION_FIELDS_SECTIONED} from "../model/education-fields";

// Component props
export type EducationFieldPickerProps = {
    fields?: string[];
    onChange?: (fields: string[]) => void;
} & Partial<MultiPickerProps>;

class EducationFieldPicker extends React.Component<EducationFieldPickerProps> {
    render(): JSX.Element {
        const {fields, onChange, ...otherProps} = this.props;

        return (
            <SectionedMultiPicker
                values={EDUCATION_FIELDS_SECTIONED}
                genLabel={(field: string) => `educationFields.${field}`}
                genSectionLabel={(section: string) => `educationFieldCategories.${section}`}
                selected={fields}
                onChange={(values: string[]) => {
                    if (onChange) onChange(values);
                }}
                placeholder={i18n.t("educationFieldsPicker.placeholder")}
                multipleText={i18n.t("educationFieldsPicker.multiple")}
                searchablePlaceholder={i18n.t("educationFieldsPicker.searchPlaceholder")}
                {...otherProps}
            />
        );
    }
}

export default EducationFieldPicker;
