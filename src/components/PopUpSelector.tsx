import * as React from "react";
import {StyleSheet, Text, ScrollView, TouchableOpacity, TextStyle, ViewStyle, StyleProp} from "react-native";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {CheckBox, withTheme} from "react-native-elements";
import CustomModal, {CustomModalClass} from "./modals/CustomModal";
import {pickerStyles} from "../styles/picker";
import i18n from "i18n-js";

// Component props
export type PopUpSelectorProps = ThemeProps & {
    values: string[];
    selected: string[];
    label: (value: string, i: number) => string;
    icon?: (value: string, i: number) => JSX.Element;
    onSelect?: (selected: string[]) => void;
    multiple?: boolean;
    atLeastOne?: boolean;
    placeholder?: string;
    buttonStyle?: StyleProp<ViewStyle>;
    valueStyle?: StyleProp<TextStyle>;
};

// Component state
export type PopUpSelectorState = {
    valueDict: {[key: string]: boolean};
};

class PopUpSelector extends React.Component<PopUpSelectorProps, PopUpSelectorState> {
    modalRef = React.createRef<CustomModalClass>();

    constructor(props: PopUpSelectorProps) {
        super(props);
        this.state = {valueDict: {}};
    }

    private fromSelectedProp() {
        const valueDict: {[key: string]: boolean} = {};
        this.props.selected.forEach((v) => (valueDict[v] = true));
        this.setState({...this.state, valueDict});
    }

    show(): void {
        this.fromSelectedProp();
        if (this.modalRef.current) this.modalRef.current.setModalVisible(true);
    }

    hide(apply: boolean): void {
        if (this.modalRef.current) this.modalRef.current.setModalVisible(false);
        if (apply) this.apply();
        else this.fromSelectedProp();
    }

    toggleValue(v: string) {
        const dict = this.state.valueDict;
        const newValue = !dict[v];

        if (this.props.multiple) {
            this.setState({...this.state, valueDict: {...dict, [v]: newValue}});
        } else {
            this.setState({...this.state, valueDict: {[v]: newValue}}, () => {
                if (newValue) this.hide(true);
            });
        }
    }

    apply(): void {
        const {onSelect} = this.props;
        const valueDict = this.state.valueDict;
        if (onSelect) {
            const selected = Object.keys(valueDict).filter((val: string) => valueDict[val]);
            onSelect(selected);
        }
    }

    render(): JSX.Element {
        const {
            values,
            selected,
            label,
            icon,
            multiple,
            atLeastOne,
            placeholder,
            buttonStyle,
            valueStyle,
            theme,
        } = this.props;
        const {valueDict} = this.state;
        const styles = themedStyles(theme);
        const pstyles = pickerStyles(theme);

        return (
            <>
                <TouchableOpacity
                    style={[styles.button, selected.length > 0 ? styles.buttonOk : {}, buttonStyle]}
                    onPress={() => this.show()}
                >
                    {selected.length === 0 && (
                        <Text style={[styles.value, styles.placeholderText, valueStyle]} numberOfLines={2}>
                            {placeholder}
                        </Text>
                    )}
                    {selected.length > 0 && (
                        <Text style={[styles.value, valueStyle]} numberOfLines={2}>
                            {selected.map(label).join(", ")}
                        </Text>
                    )}
                </TouchableOpacity>
                <CustomModal
                    ref={this.modalRef}
                    modalViewStyle={{width: "100%", paddingHorizontal: 0, paddingVertical: 0}}
                    renderContent={() => (
                        <>
                            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                                {values.map((v: string, index: number) => (
                                    <TouchableOpacity
                                        key={`popup-selector-row-${v}`}
                                        style={styles.rowContainer}
                                        onPress={() => this.toggleValue(v)}
                                        activeOpacity={0.5}
                                    >
                                        {icon && icon(v, index)}
                                        <Text style={styles.label}>{label(v, index)}</Text>
                                        <CheckBox
                                            checked={valueDict[v]}
                                            containerStyle={styles.checkboxContainer}
                                            wrapperStyle={styles.checkboxWrapper}
                                            onPress={() => this.toggleValue(v)}
                                            size={26}
                                            {...(multiple
                                                ? {}
                                                : {checkedIcon: "check-circle", uncheckedIcon: "circle-o"})}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            {multiple && (!atLeastOne || Object.values(valueDict).some((v) => v === true)) && (
                                <TouchableOpacity
                                    onPress={() => this.hide(true)}
                                    style={[pstyles.okButton, {width: "100%"}]}
                                >
                                    <Text style={pstyles.okButtonText}>{i18n.t("ok")}</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                />
            </>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        button: {
            height: 40,
            borderRadius: 0,
            borderWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.accentTernary,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "flex-end",
        },
        buttonOk: {
            borderBottomWidth: 2,
            borderBottomColor: theme.okay,
        },
        value: {},
        placeholderText: {color: theme.textLight},
        scroll: {
            width: "100%",
        },
        scrollContent: {
            paddingHorizontal: 15,
            paddingVertical: 10,
        },
        rowContainer: {
            flexDirection: "row",
            width: "100%",
            paddingVertical: 2,
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
        },
        label: {
            color: theme.text,
            fontSize: 16,
            flexGrow: 1,
        },
        checkboxContainer: {
            padding: 0,
            marginRight: 0,
        },
        checkboxWrapper: {
            padding: 0,
        },
    });
});

export default withTheme(PopUpSelector);
