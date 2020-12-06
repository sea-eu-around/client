import * as React from "react";
import {MIN_AGE} from "../constants/profile-constants";

// Component props
export type BirthDatePickerProps = {
    date?: Date;
    open: boolean;
    onSelect?: (date: Date) => void;
    style?: React.CSSProperties;
};

const minDate = new Date(1900, 0, 0);
const maxDate = new Date(Date.now());
maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);

const formatDate = (d: Date) => d.toISOString().split("T")[0];

class BirthDatePicker extends React.Component<BirthDatePickerProps> {
    onChange(date: Date | undefined): void {
        if (date && this.props.onSelect) this.props.onSelect(date);
    }

    render(): JSX.Element {
        const {date, style} = this.props;
        return (
            <input
                type="date"
                min={formatDate(minDate)}
                max={formatDate(maxDate)}
                value={formatDate(date || maxDate)}
                onChange={(e) => this.onChange(new Date(e.target.value))}
                style={style}
            />
        );
    }
}

export default BirthDatePicker;
