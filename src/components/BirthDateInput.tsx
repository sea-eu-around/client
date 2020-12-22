import * as React from "react";
import {withTheme} from "react-native-elements";
import {MIN_AGE} from "../constants/profile-constants";
import DateInput, {DateInputClass, DateInputProps} from "./DateInput";

// Component props
export type BirthDateInputProps = Omit<Omit<DateInputProps, "minimumDate">, "maximumDate">;

const minDate = new Date(1920, 0, 0);
const maxDate = new Date(Date.now());
maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);

export class BirthDateInputClass extends React.Component<BirthDateInputProps> {
    dateInputRef = React.createRef<DateInputClass>();

    focus(): void {
        this.dateInputRef.current?.focus();
    }

    render(): JSX.Element {
        const dateInputProps = this.props;
        return <DateInput ref={this.dateInputRef} minimumDate={minDate} maximumDate={maxDate} {...dateInputProps} />;
    }
}

export default withTheme(BirthDateInputClass);
