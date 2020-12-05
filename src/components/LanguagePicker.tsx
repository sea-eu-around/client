import * as React from "react";
import i18n from "i18n-js";
import MultiPicker, {MultiPickerProps} from "./MultiPicker";
import {LANGUAGES_CODES} from "../model/languages";

// Component props
export type LanguagePickerProps = {
    languages?: string[];
    onChange?: (languages: string[]) => void;
    multiple?: boolean;
} & Partial<MultiPickerProps>;

const values = LANGUAGES_CODES;

class LanguagePicker extends React.Component<LanguagePickerProps> {
    render(): JSX.Element {
        const {languages, onChange, multiple, ...otherProps} = this.props;

        return (
            <MultiPicker
                single={!multiple}
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

export default LanguagePicker;
