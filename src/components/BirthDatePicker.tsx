import * as React from "react";

import {Platform, Text, View} from "react-native";
import i18n from "i18n-js";
import {MIN_AGE} from "../constants/profile-constants";
import DateTimePicker, {Event} from "@react-native-community/datetimepicker";
import {TouchableOpacity} from "react-native-gesture-handler";
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
    onSelect?: (date: Date) => void;
};

const styles = {
    dateButton: {
        marginTop: 4,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    dateText: {
        fontSize: 16,
    },
};

class BirthDatePicker extends React.Component<BirthDatePickerProps, BirthDatePickerState> {
    constructor(props: BirthDatePickerProps) {
        super(props);
        this.state = {
            open: false,
        };
    }

    showModal(): void {
        this.setState({...this.state, open: true});
    }

    hideModal(): void {
        this.setState({...this.state, open: false});
    }

    onChange = (date: Date | undefined) => {
        if (Platform.OS != "ios") this.hideModal();
        if (date && this.props.onSelect) this.props.onSelect(date);
    };

    render(): JSX.Element {
        const {date, theme} = this.props;
        const {open} = this.state;

        const maxDate = new Date(Date.now());
        maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);

        const localizedMonth = i18n.t(`months.${date.getMonth()}`);
        const paddedDay = ((date.getDate() + "").length == 1 ? "0" : "") + date.getDate();
        const formattedDate = `${paddedDay} ${localizedMonth} ${date.getFullYear()}`;

        return (
            <View style={{width: "100%"}}>
                <Text>{i18n.t("dateOfBirth")}</Text>
                <TouchableOpacity
                    style={[styles.dateButton, {backgroundColor: theme.accentSlight}]}
                    onPress={() => this.showModal()}
                >
                    <Text style={styles.dateText}>{formattedDate}</Text>
                </TouchableOpacity>
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
            </View>
        );
    }
}

export default reduxConnector(BirthDatePicker);
