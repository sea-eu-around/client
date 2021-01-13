import * as React from "react";
import {View, ViewProps, LayoutChangeEvent, TouchableOpacity, Text} from "react-native";
import i18n from "i18n-js";
import DropDownPicker from "react-native-dropdown-picker";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {withTheme} from "react-native-elements";
import {pickerStyles} from "../styles/picker";
import {ThemeProps} from "../types";
import {SupportedLocale} from "../localization";
import Chips from "./Chips";
import CustomModal from "./modals/CustomModal";

type PickerItem = {
    value: string;
    label: string;
};

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    locale: state.settings.userSettings.locale,
}));

// Component props
export type MultiPickerProps = ConnectedProps<typeof reduxConnector> & {
    values: string[];
    genLabel?: (value: string) => string;
    onChange?: (values: string[]) => void;
    selected?: string[];
    placeholder?: string;
    multipleText?: string;
    searchablePlaceholder?: string;
    showChips?: boolean;
    single?: boolean;
} & ViewProps &
    ThemeProps;

// Component state
export type MultiPickerState = {
    items: Map<SupportedLocale, PickerItem[]>;
    open: boolean;
    dropdownWrapperHeight: number;
};

class MultiPicker extends React.Component<MultiPickerProps, MultiPickerState> {
    static defaultProps = {
        items: [],
        showSelected: true,
        selected: [],
    };

    tempSelected: string[] = [];

    constructor(props: MultiPickerProps) {
        super(props);
        this.state = {
            items: new Map(),
            open: false,
            dropdownWrapperHeight: 0,
        };
        if (props.selected) this.tempSelected = props.selected;
    }

    updateItems() {
        const locale = this.props.locale;
        if (!this.state.items.has(locale) || this.state.items.get(locale)?.length != this.props.values.length) {
            const items = new Map(this.state.items);
            items.set(
                locale,
                this.props.values.map((value: string) => ({
                    value,
                    label: this.props.genLabel ? i18n.t(this.props.genLabel(value)) : value,
                })),
            );
            this.setState({...this.state, items});
        }
    }

    componentDidMount() {
        this.updateItems();
    }

    componentDidUpdate(oldProps: MultiPickerProps) {
        if (oldProps.locale != this.props.locale || oldProps.values.length != this.props.values.length) {
            this.updateItems();
        }
        this.tempSelected = this.props.selected || [];
    }

    open() {
        this.setState({...this.state, open: true});
    }

    close() {
        this.setState({...this.state, open: false});
        this.apply();
    }

    apply() {
        if (this.props.onChange) this.props.onChange(this.tempSelected);
    }

    render(): JSX.Element {
        const {
            theme,
            locale,
            selected,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onChange,
            genLabel,
            placeholder,
            multipleText,
            searchablePlaceholder,
            showChips,
            single,
            ...viewProps
        } = this.props;
        const styles = pickerStyles(theme);

        const selectedItems = selected || [];
        const items = this.state.items.get(locale) || [];

        return (
            <View {...viewProps}>
                <View>
                    <TouchableOpacity onPress={() => this.open()} style={styles.openButton}>
                        <Text style={styles.openButtonText}>
                            {i18n.t("picker.callToAction").replace("%d", selectedItems.length.toString())}
                        </Text>
                    </TouchableOpacity>
                    {showChips && (
                        <Chips
                            items={selectedItems}
                            label={(v) => (genLabel ? i18n.t(genLabel(v)) : v)}
                            containerStyle={styles.chipContainer}
                            removable={true}
                            onRemove={(item: string) => {
                                this.tempSelected = this.tempSelected.filter((v) => v !== item);
                                this.apply();
                            }}
                        />
                    )}
                </View>
                {this.state.open && (
                    <CustomModal
                        visible={this.state.open}
                        onHide={() => this.close()}
                        modalViewStyle={{
                            height: 150 + items.length * 40,
                            maxHeight: "70%",
                            overflow: "hidden",
                            paddingHorizontal: 0,
                            paddingVertical: 0,
                        }}
                        renderContent={() => (
                            <>
                                <View
                                    style={styles.dropdownWrapper}
                                    onLayout={(e: LayoutChangeEvent) => {
                                        this.setState({
                                            ...this.state,
                                            dropdownWrapperHeight: e.nativeEvent.layout.height,
                                        });
                                    }}
                                >
                                    <DropDownPicker
                                        items={items}
                                        multiple={!single}
                                        searchable={true}
                                        defaultValue={selected}
                                        onChangeItem={(values: string[]) => {
                                            this.tempSelected = values;
                                        }}
                                        placeholder={placeholder}
                                        multipleText={multipleText}
                                        searchablePlaceholder={searchablePlaceholder}
                                        scrollViewProps={{keyboardShouldPersistTaps: "handled"}} // ensures items are clickable even when the keyboard is open
                                        isVisible={true}
                                        showArrow={false}
                                        dropDownMaxHeight={this.state.dropdownWrapperHeight - 10}
                                        // Style props
                                        selectedLabelStyle={{display: "none"}}
                                        style={styles.dropdownStyle}
                                        itemStyle={styles.dropdownItemStyle}
                                        activeItemStyle={styles.dropdownActiveItemStyle}
                                        activeLabelStyle={styles.dropdownActiveLabelStyle}
                                        labelStyle={styles.dropdownLabelStyle}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => this.close()} style={styles.okButton}>
                                    <Text style={styles.okButtonText}>OK</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    />
                )}
            </View>
        );
    }
}

export default reduxConnector(withTheme(MultiPicker));
