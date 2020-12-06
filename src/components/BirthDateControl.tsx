import * as React from "react";
import {View, StyleSheet, Platform} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import {FormattedDate} from "./FormattedDate";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import BirthDatePicker from "./BirthDatePicker";
import {webFontFamily} from "../styles/general";

// Component props
export type BirthDateControlProps = ThemeProps & {
    date?: Date;
    onSelect?: (date: Date) => void;
};

// Component state
export type BirthDateControlState = {
    open: boolean;
};

class BirthDateControl extends React.Component<BirthDateControlProps, BirthDateControlState> {
    constructor(props: BirthDateControlProps) {
        super(props);
        this.state = {open: false};
    }

    showModal(): void {
        if (!this.state.open) this.setState({...this.state, open: true});
    }

    hideModal(): void {
        if (this.state.open) this.setState({...this.state, open: false});
    }

    render(): JSX.Element {
        const {date, onSelect, theme} = this.props;
        const {open} = this.state;
        const styles = themedStyles(theme);

        return (
            <View style={styles.wrapper}>
                {Platform.OS !== "web" ? (
                    <>
                        <TouchableOpacity
                            style={[styles.button, date ? styles.buttonOk : {}]}
                            onPress={() => this.showModal()}
                        >
                            {date && <FormattedDate style={styles.dateText} date={date} />}
                            {/*!date && <Text>Click to change value</Text>*/}
                        </TouchableOpacity>
                        <BirthDatePicker
                            date={date}
                            open={open}
                            onSelect={(date: Date) => {
                                this.hideModal();
                                if (onSelect) onSelect(date);
                            }}
                        />
                    </>
                ) : (
                    <BirthDatePicker
                        date={date}
                        open={true}
                        onSelect={(date) => {
                            if (onSelect) onSelect(date);
                        }}
                        style={{
                            width: "100%",
                            height: 60,
                            borderRadius: 0,
                            borderWidth: 0,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.accentTernary,
                            backgroundColor: "transparent",
                            justifyContent: "center",
                            outline: 0,
                            fontSize: 20,
                            color: theme.text,
                            ...webFontFamily,
                            ...(date ? {borderBottomWidth: 2, borderBottomColor: theme.okay} : {}),
                        }}
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
