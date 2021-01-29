import * as React from "react";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {TextInput, TextInputProps, View, StyleSheet, StyleProp, TextStyle, ViewStyle} from "react-native";
import {preTheme} from "../styles/utils";
import i18n from "i18n-js";

// Component props
export type DateInputProps = {
    date?: Date;
    onChange?: (date?: Date, error?: string) => void;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    inputStyleFocused?: StyleProp<TextStyle>;
    inputStyleValid?: StyleProp<TextStyle>;
    minimumDate?: Date;
    maximumDate?: Date;
    autoFocus?: boolean;
} & ThemeProps;

// Component state
type DateInputState = {
    year: string;
    month: string;
    day: string;
    touched: boolean;
    error: string | undefined;
    focused1: boolean;
    focused2: boolean;
    focused3: boolean;
};

const dateInputProps = (
    ref: React.RefObject<TextInput>,
    value: string,
    maxLength: number,
    next?: React.RefObject<TextInput>,
    onChange?: (v: string) => void,
): TextInputProps => ({
    autoCorrect: false,
    clearTextOnFocus: true,
    keyboardType: "number-pad",
    returnKeyType: next ? "next" : "done",
    value,
    maxLength,
    onSubmitEditing: () => {
        if (next) next.current?.focus();
    },
    onChangeText: (text: string) => {
        text = text.replace(/\D+/g, ""); // only keep numbers
        if (onChange) onChange(text);
        if (text.length == maxLength) {
            if (next) next.current?.focus();
            else ref.current?.blur();
        }
    },
});

export class DateInputClass extends React.Component<DateInputProps, DateInputState> {
    constructor(props: DateInputProps) {
        super(props);
        this.state = this.deriveStateFromDate(props.date);
    }

    input1Ref = React.createRef<TextInput>();
    input2Ref = React.createRef<TextInput>();
    input3Ref = React.createRef<TextInput>();

    componentDidUpdate(oldProps: DateInputProps): void {
        if (this.props.date != oldProps.date) {
            this.setState({...this.state, ...this.deriveStateFromDate(this.props.date)});
        }
    }

    focus(): void {
        this.input1Ref.current?.focus();
    }

    private validDate(): {date?: Date; error?: string} {
        const {year, month, day} = this.state;
        const parsable = year.length >= 4 && month.length > 0 && day.length > 0;

        if (parsable) {
            try {
                const pyear = parseInt(year);
                const pmonth = parseInt(month) - 1;
                const pday = parseInt(day);
                // Verify that all individual parts of the date are correct.
                if (pyear > 0 && pmonth >= 0 && pmonth < 12 && pday > 0 && pday <= 31) {
                    const date = new Date(pyear, pmonth, pday);
                    const error = this.getError(date);
                    if (error) return {error};
                    else return {date};
                }
            } catch (e) {}
            return {error: "validation.date.invalid"};
        } else if (this.state.touched) return {error: "validation.date.invalid"};

        // If one of the fields is empty, we only output an error if the input was touched
        // i.e. it was completed before
        return {};
    }

    private getError(date: Date): string | undefined {
        const {minimumDate, maximumDate} = this.props;
        if (maximumDate && date > maximumDate) return "validation.date.tooYoung";
        else if (minimumDate && date < minimumDate) return "validation.date.invalid";
        else return undefined;
    }

    deriveStateFromDate(date?: Date): DateInputState {
        const year = date?.getFullYear();
        const month = date?.getMonth();
        const day = date?.getDate();

        return {
            year: year === undefined ? "" : year + "",
            month: month === undefined ? "" : month + 1 + "",
            day: day === undefined ? "" : day + "",
            touched: date !== undefined,
            error: date ? this.getError(date) : undefined,
            focused1: this.state ? this.state.focused1 : false,
            focused2: this.state ? this.state.focused2 : false,
            focused3: this.state ? this.state.focused3 : false,
        };
    }

    set(values: Partial<DateInputState>): void {
        const {onChange} = this.props;
        this.setState({...this.state, ...values}, () => {
            if (onChange) {
                const {date, error} = this.validDate();
                if (date || error) {
                    onChange(date, error);
                    this.setState({...this.state, touched: true, error});
                }
            }
        });
    }

    render(): JSX.Element {
        const {inputStyle, containerStyle, inputStyleFocused, autoFocus, theme} = this.props;
        const {year, month, day, touched, error, focused1, focused2, focused3} = this.state;
        const styles = themedStyles(theme);
        const valid = touched && !error;
        const inputStyleValid = valid ? this.props.inputStyleValid : {};

        return (
            <View style={[styles.container, containerStyle]}>
                <TextInput
                    {...dateInputProps(this.input1Ref, day, 2, this.input2Ref, (day) => this.set({day}))}
                    ref={this.input1Ref}
                    style={[
                        styles.input,
                        styles.inputDay,
                        inputStyle,
                        focused1 ? inputStyleFocused : {},
                        inputStyleValid,
                    ]}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholder={i18n.t("dateInput.dayPlaceholder")}
                    autoFocus={autoFocus}
                    onBlur={() => this.setState({focused1: false})}
                    onFocus={() => this.setState({focused1: true})}
                />
                <TextInput
                    {...dateInputProps(this.input2Ref, month, 2, this.input3Ref, (month) => this.set({month}))}
                    ref={this.input2Ref}
                    style={[
                        styles.input,
                        styles.inputMonth,
                        inputStyle,
                        focused2 ? inputStyleFocused : {},
                        inputStyleValid,
                    ]}
                    blurOnSubmit={false}
                    onSubmitEditing={() => this.input3Ref.current?.focus()}
                    returnKeyType="next"
                    placeholder={i18n.t("dateInput.monthPlaceholder")}
                    onBlur={() => this.setState({focused2: false})}
                    onFocus={() => this.setState({focused2: true})}
                />
                <TextInput
                    {...dateInputProps(this.input3Ref, year, 4, undefined, (year) => this.set({year}))}
                    ref={this.input3Ref}
                    style={[
                        styles.input,
                        styles.inputYear,
                        inputStyle,
                        focused3 ? inputStyleFocused : {},
                        inputStyleValid,
                    ]}
                    returnKeyType="done"
                    placeholder={i18n.t("dateInput.yearPlaceholder")}
                    onBlur={() => this.setState({focused3: false})}
                    onFocus={() => this.setState({focused3: true})}
                />
            </View>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            flexDirection: "row",
        },
        input: {
            borderWidth: 1,
            borderColor: theme.componentBorder,
            paddingHorizontal: 6,
            textAlign: "center",
        },
        inputDay: {flex: 1},
        inputMonth: {flex: 1, marginLeft: 10},
        inputYear: {flex: 2, marginLeft: 10},
    });
});

export default withTheme(DateInputClass);
