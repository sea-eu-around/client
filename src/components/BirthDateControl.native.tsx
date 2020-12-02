import * as React from "react";
import {View, StyleSheet, Platform} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import {FormattedDate} from "./FormattedDate";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {MIN_AGE} from "../constants/profile-constants";
import DateTimePicker, {Event} from "@react-native-community/datetimepicker";

// Component props
export type BirthDateControlProps = ThemeProps & {
    date?: Date;
    onSelect?: (date: Date) => void;
    onHide?: () => void;
};

// Component state
export type BirthDateControlState = {
    open: boolean;
};

const minDate = new Date(1900, 0, 0);
const maxDate = new Date(Date.now());
maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);

class BirthDateControl extends React.Component<BirthDateControlProps, BirthDateControlState> {
    constructor(props: BirthDateControlProps) {
        super(props);
        this.state = {
            open: Platform.OS === "ios",
        };
    }

    showModal(): void {
        if (!this.state.open) this.setState({...this.state, open: true});
    }

    hideModal(): void {
        if (this.state.open && Platform.OS !== "ios") {
            this.setState({...this.state, open: false});
            if (this.props.onHide) this.props.onHide();
        }
    }

    render(): JSX.Element {
        const {date, onSelect, theme} = this.props;
        const {open} = this.state;
        const styles = themedStyles(theme);

        return (
            <View style={styles.wrapper}>
                <TouchableOpacity style={[styles.button, date ? styles.buttonOk : {}]} onPress={() => this.showModal()}>
                    {date && <FormattedDate style={styles.dateText} date={date} />}
                    {/*!date && <Text>Click to change value</Text>*/}
                </TouchableOpacity>
                {open && (
                    <DateTimePicker
                        minimumDate={minDate}
                        maximumDate={maxDate}
                        value={date || maxDate}
                        textColor={theme.text}
                        display="default"
                        onChange={(e: Event, date: Date | undefined) => {
                            this.hideModal();
                            if (date && onSelect) onSelect(date);
                        }}
                        mode="date"
                    />
                )}
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            width: "100%",
        },
        button: {
            width: "100%",
            height: 60,
            borderRadius: 0,
            borderWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.accentTernary,
            backgroundColor: "transparent",
            justifyContent: "center",
        },
        buttonOk: {
            borderBottomWidth: 2,
            borderBottomColor: theme.okay,
        },
        dateText: {
            fontSize: 20,
            color: theme.text,
        },
    });
});

export default withTheme(BirthDateControl);