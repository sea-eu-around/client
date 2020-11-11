import * as React from "react";
import i18n from "i18n-js";
import MultiPicker, {MultiPickerProps} from "./MultiPicker";
import {LANGUAGES_CODES} from "../model/languages";

// Component props
export type MultiLanguagePickerProps = {
    languages?: string[];
    onChange?: (languages: string[]) => void;
} & Partial<MultiPickerProps>;

const values = LANGUAGES_CODES;

class MultiLanguagePicker extends React.Component<MultiLanguagePickerProps> {
    render(): JSX.Element {
        const {languages, onChange, ...otherProps} = this.props;

        return (
            <MultiPicker
                values={values}
                genLabel={(languageId: string) => `languageNames.${languageId}`}
                selected={languages}
                onChange={(values: string[]) => {
                    if (onChange) onChange(values);
                }}
                placeholder={i18n.t("languagePicker.placeholderMultiple")}
                multipleText={i18n.t("languagePicker.multiple")}
                searchablePlaceholder={i18n.t("languagePicker.searchPlaceholder")}
                {...otherProps}
            />
        );
    }
}

export default MultiLanguagePicker;
