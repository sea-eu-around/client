import * as React from "react";
import i18n from "i18n-js";
import SectionedMultiPicker, {SectionedMultiPickerProps} from "./SectionedMultiPicker";
import {EDUCATION_FIELDS_SECTIONED} from "../model/education-fields";

// Component props
export type EducationFieldPickerProps = {
    fields?: string[];
    onChange?: (fields: string[]) => void;
} & Partial<SectionedMultiPickerProps>;

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
                searchablePlaceholder={i18n.t("educationFieldsPicker.searchPlaceholder")}
                {...otherProps}
            />
        );
    }
}

export default EducationFieldPicker;
