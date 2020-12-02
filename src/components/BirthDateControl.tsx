import * as React from "react";
import {View, StyleSheet} from "react-native";
import {ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {MIN_AGE} from "../constants/profile-constants";

// Component props
export type BirthDateControlProps = ThemeProps & {
    date?: Date;
    onSelect?: (date: Date) => void;
    onHide?: () => void;
};

const minDate = new Date(1900, 0, 0);
const maxDate = new Date(Date.now());
maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);

const formatDate = (d: Date) => d.toISOString().split("T")[0];

class BirthDateControl extends React.Component<BirthDateControlProps> {
    render(): JSX.Element {
        const {date, onSelect, theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.wrapper}>
                <input
                    type="date"
                    min={formatDate(minDate)}
                    max={formatDate(maxDate)}
                    value={formatDate(date || maxDate)}
                    onChange={(e) => {
                        if (onSelect) onSelect(new Date(e.target.value));
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
                    }}
                />
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

export default withTheme(BirthDateControl);
