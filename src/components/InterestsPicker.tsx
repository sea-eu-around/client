import * as React from "react";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {InterestDto} from "../api/dto";
import MultiPicker from "./MultiPicker";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    allInterests: state.profile.interests,
}));

let values: string[] = [];

// Component props
export type InterestsPickerProps = ConnectedProps<typeof reduxConnector> & {
    interests: string[];
    onChange?: (interests: string[]) => void;
};

class InterestsPicker extends React.Component<InterestsPickerProps> {
    static defaultProps = {
        interests: [],
    };

    componentDidMount() {
        if (values.length == 0) this.updateValues();
    }

    componentDidUpdate(oldProps: InterestsPickerProps) {
        if (oldProps.allInterests.length != this.props.allInterests.length) this.updateValues();
    }

    updateValues() {
        values = this.props.allInterests.map((interest: InterestDto) => interest.name); // TODO replace with key

        console.log("Interests : " + this.props.allInterests.length);
        this.forceUpdate();
    }

    render(): JSX.Element {
        const {interests, onChange} = this.props;

        return (
            <MultiPicker
                values={values}
                genLabel={(interestKey: string) => `interestNames.${interestKey}`}
                defaultValues={interests}
                onChange={(values: string[]) => {
                    if (onChange) onChange(values);
                }}
                placeholder={i18n.t("interestsPicker.placeholder")}
                multipleText={i18n.t("interestsPicker.multiple")}
                searchablePlaceholder={i18n.t("interestsPicker.searchPlaceholder")}
            />
        );
    }
}

export default reduxConnector(InterestsPicker);
