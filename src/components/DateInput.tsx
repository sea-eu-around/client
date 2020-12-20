import * as React from "react";
import {MIN_AGE} from "../constants/profile-constants";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {TextInput, TextInputProps, View, StyleSheet, StyleProp, TextStyle} from "react-native";
import {preTheme} from "../styles/utils";

// TODO DateInput

// Component props
export type DateInputProps = {
    date?: Date;
    onChange?: (date?: Date) => void;
    inputStyle: StyleProp<TextStyle>;
} & ThemeProps;

type DateInputState = {
    year: string;
    month: string;
    day: string;
};

const minDate = new Date(1920, 0, 0);
const maxDate = new Date(Date.now());
maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);

class DateInput extends React.Component<DateInputProps, DateInputState> {
    constructor(props: DateInputProps) {
        super(props);
        const year = props.date?.getFullYear();
        const month = props.date?.getMonth();
        const day = props.date?.getDay();
        this.state = {
            year: year ? year + 1 + "" : "",
            month: year ? year + 1 + "" : "",
            day: year ? year + 1 + "" : "",
        };
    }

    input1Ref = React.createRef<TextInput>();
    input2Ref = React.createRef<TextInput>();
    input3Ref = React.createRef<TextInput>();

    private validDateOrUndefined(): Date | undefined {
        const {year, month, day} = this.state;
        if (year.length > 0 && month.length > 0 && day.length > 0) {
            try {
                const pyear = parseInt(year);
                const pmonth = parseInt(month) - 1;
                const pday = parseInt(day);
                console.log(pyear, pmonth, pday);
                if (pyear > 0 && pmonth > 0 && pday > 0 && pmonth <= 12 && pday <= 31) {
                    const d = new Date(pyear, pmonth, pday);
                    if (d >= minDate && d <= maxDate) return d;
                }
            } catch (e) {
                console.log(e);
            }
        }
        return undefined;
    }

    notifyChange() {
        const {onChange} = this.props;
        const d = this.validDateOrUndefined();
        if (d) {
            if (onChange) onChange(d);
        } else {
            if (onChange) onChange(undefined);
        }
    }

    set(values: Partial<DateInputState>) {
        this.setState({...this.state, ...values}, this.notifyChange);
    }

    render(): JSX.Element {
        const {date, inputStyle, theme} = this.props;
        const {year, month, day} = this.state;
        const styles = themedStyles(theme);

        /*const year = date?.getFullYear();
        const month = date?.getMonth();
        const day = date?.getDay();*/

        const commonInputProps = (
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

        return (
            <View style={styles.container}>
                <TextInput
                    {...commonInputProps(this.input1Ref, day, 2, this.input2Ref, (day) => this.set({day}))}
                    ref={this.input1Ref}
                    style={[styles.input, styles.inputDay, inputStyle]}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholder={"Day"}
                />
                <TextInput
                    {...commonInputProps(this.input2Ref, month, 2, this.input3Ref, (month) => this.set({month}))}
                    ref={this.input2Ref}
                    style={[styles.input, styles.inputMonth, inputStyle]}
                    blurOnSubmit={false}
                    onSubmitEditing={() => this.input3Ref.current?.focus()}
                    returnKeyType="next"
                    placeholder={"Month"}
                />
                <TextInput
                    {...commonInputProps(this.input3Ref, year, 4, undefined, (year) => this.set({year}))}
                    ref={this.input3Ref}
                    style={[styles.input, styles.inputYear, inputStyle]}
                    returnKeyType="done"
                    placeholder={"Year"}
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
        },
        inputDay: {
            flex: 1,
        },
        inputMonth: {
            flex: 1,
        },
        inputYear: {
            flex: 2,
        },
    });
});

export default withTheme(DateInput);
