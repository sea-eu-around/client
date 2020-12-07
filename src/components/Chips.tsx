import {MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
import {StyleProp, Text, View, ViewStyle, StyleSheet, TextStyle} from "react-native";
import {ThemeConsumer, withTheme} from "react-native-elements";
import {TouchableOpacity} from "react-native-gesture-handler";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";

// Component props
export type ChipsProps<T> = {
    items: T[];
    label?: (item: T) => string;
    removable?: boolean;
    onRemove?: (item: T) => void;
    containerStyle?: StyleProp<ViewStyle>;
    chipStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
};

class Chips<T> extends React.Component<ChipsProps<T>> {
    render(): JSX.Element {
        const {items, label, removable, onRemove, containerStyle, chipStyle, textStyle} = this.props;

        return (
            // Use a theme consumer instead of the withTheme() pattern because it breaks genericity
            <ThemeConsumer>
                {({theme}: ThemeProps) => {
                    const styles = themedStyles(theme);
                    return (
                        <View style={[styles.container, containerStyle]}>
                            {items.map((it: T, i: number) => (
                                <Chip
                                    key={`chips-${i}-${it}`}
                                    text={label ? label(it) : typeof it === "string" ? it : JSON.stringify(it)}
                                    removable={removable}
                                    onRemove={() => {
                                        if (onRemove) onRemove(it);
                                    }}
                                    chipStyle={chipStyle}
                                    textStyle={textStyle}
                                />
                            ))}
                        </View>
                    );
                }}
            </ThemeConsumer>
        );
    }
}

type ChipProps = {
    text: string;
    removable?: boolean;
    onRemove?: () => void;
    chipStyle: StyleProp<ViewStyle>;
    textStyle: StyleProp<TextStyle>;
} & ThemeProps;

const Chip = withTheme(
    ({text, removable, onRemove, theme, chipStyle, textStyle}: ChipProps): JSX.Element => {
        const styles = themedStyles(theme);
        return (
            <View style={[styles.chip, chipStyle]}>
                <Text style={[styles.chipText, textStyle]}>{text}</Text>
                {removable && (
                    <TouchableOpacity
                        style={styles.chipRemoveButton}
                        onPress={() => {
                            if (onRemove) onRemove();
                        }}
                    >
                        <MaterialIcons name="close" style={styles.chipRemoveIcon} />
                    </TouchableOpacity>
                )}
            </View>
        );
    },
);

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
        },
        chip: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.accentSlight,
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 20,
            marginRight: 4,
            marginBottom: 4,
        },
        chipText: {
            fontSize: 14,
            color: theme.text,
        },
        chipRemoveButton: {
            padding: 2,
        },
        chipRemoveIcon: {
            fontSize: 22,
            color: theme.text,
        },
    });
});

export default Chips;
