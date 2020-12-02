import * as React from "react";
import {MIN_AGE} from "../constants/profile-constants";
import DateTimePicker, {Event} from "@react-native-community/datetimepicker";

// Component props
export type BirthDatePickerProps = {
    date?: Date;
    open: boolean;
    onSelect?: (date: Date) => void;
};

const minDate = new Date(1900, 0, 0);
const maxDate = new Date(Date.now());
maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);

class BirthDatePicker extends React.Component<BirthDatePickerProps> {
    onChange(date: Date | undefined): void {
        if (date && this.props.onSelect) this.props.onSelect(date);
        //if (Platform.OS != "ios") this.hideModal();
    }

    render(): JSX.Element {
        const {date, open} = this.props;
        return (
            <>
                {open && (
                    <DateTimePicker
                        minimumDate={minDate}
                        maximumDate={maxDate}
                        value={date || maxDate}
                        display="default"
                        onChange={(e: Event, date: Date | undefined) => this.onChange(date)}
                        mode="date"
                    />
                )}
            </>
        );
    }
}

export default BirthDatePicker;
