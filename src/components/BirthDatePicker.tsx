import * as React from "react";
import {Platform} from "react-native";
import {MIN_AGE} from "../constants/profile-constants";
import DateTimePicker, {Event} from "@react-native-community/datetimepicker";

// Component props
export type BirthDatePickerProps = {
    date?: Date;
    open: boolean;
    onSelect?: (date: Date) => void;
    onHide?: () => void;
};

// Component state
export type BirthDatePickerState = {
    open: boolean;
};

class BirthDatePicker extends React.Component<BirthDatePickerProps, BirthDatePickerState> {
    constructor(props: BirthDatePickerProps) {
        super(props);
        this.state = {
            open: props.open,
        };
    }

    componentDidUpdate(oldProps: BirthDatePickerProps): void {
        if (!oldProps.open && this.props.open) this.showModal();
        if (oldProps.open && !this.props.open) this.hideModal();
    }

    showModal(): void {
        if (!this.state.open) this.setState({...this.state, open: true});
    }

    hideModal(): void {
        if (this.state.open) {
            this.setState({...this.state, open: false});
            if (this.props.onHide !== undefined) this.props.onHide();
        }
    }

    onChange(date: Date | undefined): void {
        if (Platform.OS != "ios") this.hideModal();
        if (date && this.props.onSelect) this.props.onSelect(date);
    }

    render(): JSX.Element {
        const {date} = this.props;
        const {open} = this.state;

        const maxDate = new Date(Date.now());
        maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);

        return (
            <>
                {open && (
                    <DateTimePicker
                        minimumDate={new Date(1900, 0, 0)}
                        maximumDate={maxDate}
                        value={date || maxDate}
                        onChange={(e: Event, date: Date | undefined) => this.onChange(date)}
                        mode="date"
                    />
                )}
            </>
        );
    }
}

export default BirthDatePicker;
