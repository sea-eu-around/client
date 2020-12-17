import * as React from "react";
import {MIN_AGE} from "../constants/profile-constants";
import DateTimePicker, {Event} from "@react-native-community/datetimepicker";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";
import {Platform} from "react-native";
import {ErrorBoundary} from "./utility/ErrorBoundary";
import CustomModal from "./modals/CustomModal";

// Component props
export type BirthDatePickerProps = {
    date?: Date;
    open: boolean;
    onSelect?: (date: Date) => void;
} & ThemeProps;

const minDate = new Date(1920, 0, 0);
const maxDate = new Date(Date.now());
maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);

class BirthDatePicker extends React.Component<BirthDatePickerProps> {
    onChange(date: Date | undefined): void {
        if (date && this.props.onSelect) this.props.onSelect(date);
    }

    render(): JSX.Element {
        const {date, open, theme} = this.props;

        const picker = (
            <DateTimePicker
                minimumDate={minDate}
                maximumDate={maxDate}
                value={date || maxDate}
                display={Platform.OS === "ios" ? "inline" : "default"}
                mode="date"
                textColor={theme.text}
                {...(Platform.OS === "ios" ? {style: {width: "100%"}} : {})}
                onChange={(e: Event, date: Date | undefined) => this.onChange(date)}
            />
        );

        console.log(`[DateTimePicker] open=${open}`);
        if (Platform.OS === "ios") return <CustomModal visible={open} renderContent={() => picker} />;
        // Wrap with an ErrorBoundary to prevent crashes on Android which we can't do much about
        else if (open) return <ErrorBoundary>{picker}</ErrorBoundary>;
        else return <></>;
    }
}

export default withTheme(BirthDatePicker);
