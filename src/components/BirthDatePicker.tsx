import * as React from "react";
import {Platform} from "react-native";
import {MIN_AGE} from "../constants/profile-constants";
import DateTimePicker, {Event} from "@react-native-community/datetimepicker";
import themes from "../constants/themes";
import {AppState} from "../state/types";
import {connect, ConnectedProps} from "react-redux";

export type BirthDatePickerState = {
    open: boolean;
};

// Map props from store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.theming.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
export type BirthDatePickerProps = ConnectedProps<typeof reduxConnector> & {
    date: Date;
    open: boolean;
    onSelect?: (date: Date) => void;
    onHide?: () => void;
};

class BirthDatePicker extends React.Component<BirthDatePickerProps, BirthDatePickerState> {
    constructor(props: BirthDatePickerProps) {
        super(props);
        this.state = {
            open: props.open,
        };
    }

    showModal(): void {
        this.setState({...this.state, open: true});
    }

    hideModal(): void {
        this.setState({...this.state, open: false});
        if (this.props.onHide !== undefined) this.props.onHide();
    }

    onChange = (date: Date | undefined) => {
        if (Platform.OS != "ios") this.hideModal();
        if (date && this.props.onSelect) this.props.onSelect(date);
    };

    render(): JSX.Element {
        const {date} = this.props;
        const {open} = this.state;

        const maxDate = new Date(Date.now());
        maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);

        return (
            <React.Fragment>
                {open && (
                    <DateTimePicker
                        style={{width: "100%", height: 50}}
                        minimumDate={new Date(1900, 0, 0)}
                        maximumDate={maxDate}
                        value={date}
                        onChange={(e: Event, date: Date | undefined) => this.onChange(date)}
                        mode="date"
                    />
                )}
            </React.Fragment>
        );
    }
}

export default reduxConnector(BirthDatePicker);
