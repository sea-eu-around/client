import * as React from "react";
import i18n from "i18n-js";
import MultiPicker, {MultiPickerProps} from "./MultiPicker";
import {PARTNER_UNIVERSITIES, University} from "../constants/universities";

let values: string[] = [];

// Component props
export type MultiUniversityPickerProps = {
    universities: string[];
    onChange?: (unis: string[]) => void;
} & Partial<MultiPickerProps>;

class MultiUniversityPicker extends React.Component<MultiUniversityPickerProps> {
    componentDidMount(): void {
        if (values.length == 0) values = PARTNER_UNIVERSITIES.map((uni: University) => uni.key);
    }

    render(): JSX.Element {
        const {universities, onChange, ...otherProps} = this.props;

        return (
            <MultiPicker
                values={values}
                genLabel={(univKey: string) => `universities.${univKey}`}
                selected={universities}
                onChange={(values: string[]) => {
                    if (onChange) onChange(values);
                }}
                placeholder={i18n.t("universitiesPicker.placeholder")}
                multipleText={i18n.t("universitiesPicker.multiple")}
                searchablePlaceholder={i18n.t("universitiesPicker.searchPlaceholder")}
                {...otherProps}
            />
        );
    }
}

export default MultiUniversityPicker;
