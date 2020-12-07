import * as React from "react";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {InterestDto} from "../api/dto";
import MultiPicker, {MultiPickerProps} from "./MultiPicker";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    allInterests: state.profile.interests,
}));

let values: string[] = [];

// Component props
export type InterestsPickerProps = ConnectedProps<typeof reduxConnector> & {
    interests: string[];
    onChange?: (interests: string[]) => void;
} & Partial<MultiPickerProps>;

class InterestsPicker extends React.Component<InterestsPickerProps> {
    componentDidMount() {
        if (values.length == 0) this.updateValues();
    }

    componentDidUpdate(oldProps: InterestsPickerProps) {
        if (oldProps.allInterests.length != this.props.allInterests.length) this.updateValues();
    }

    updateValues() {
        values = this.props.allInterests.map((interest: InterestDto) => interest.id);

        console.log("Interests : " + this.props.allInterests.length);
        this.forceUpdate();
    }

    render(): JSX.Element {
        const {interests, onChange, ...otherProps} = this.props;

        return (
            <MultiPicker
                values={values}
                genLabel={(interestId: string) => `interestNames.${interestId}`}
                selected={interests}
                onChange={(values: string[]) => {
                    if (onChange) onChange(values);
                }}
                placeholder={i18n.t("interestsPicker.placeholder")}
                multipleText={i18n.t("interestsPicker.multiple")}
                searchablePlaceholder={i18n.t("interestsPicker.searchPlaceholder")}
                {...otherProps}
            />
        );
    }
}

export default reduxConnector(InterestsPicker);
