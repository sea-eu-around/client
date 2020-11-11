import * as React from "react";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import MultiPicker, {MultiPickerProps} from "./MultiPicker";
import {PARTNER_UNIVERSITIES, University} from "../constants/universities";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    //allInterests: state.profile.interests,
    // TODO add universities here
}));

let values: string[] = [];

// Component props
export type MultiUniversityPickerProps = ConnectedProps<typeof reduxConnector> & {
    universities: string[];
    onChange?: (unis: string[]) => void;
} & Partial<MultiPickerProps>;

class MultiUniversityPicker extends React.Component<MultiUniversityPickerProps> {
    componentDidMount() {
        if (values.length == 0) this.updateValues();
    }

    componentDidUpdate(oldProps: MultiUniversityPickerProps) {
        //if (oldProps.allInterests.length != this.props.allInterests.length) this.updateValues();
    }

    updateValues() {
        //values = this.props.allInterests.map((interest: InterestDto) => interest.id);
        values = PARTNER_UNIVERSITIES.map((uni: University) => uni.key);

        this.forceUpdate();
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

export default reduxConnector(MultiUniversityPicker);
