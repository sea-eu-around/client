import * as React from "react";
import {View, StyleSheet} from "react-native";
import {ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {MIN_AGE} from "../constants/profile-constants";
import DateInput, {DateInputProps} from "./DateInput";

// Component props
export type BirthDateInputProps = ThemeProps & DateInputProps;

const minDate = new Date(1920, 0, 0);
const maxDate = new Date(Date.now());
maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);

class BirthDateInput extends React.Component<BirthDateInputProps> {
    render(): JSX.Element {
        const {theme, ...dateInputProps} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.wrapper}>
                <DateInput minimumDate={minDate} maximumDate={maxDate} {...dateInputProps} />
            </View>
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        wrapper: {
            width: "100%",
        },
    });
});

export default withTheme(BirthDateInput);
