import * as React from "react";
import {View, ViewProps, LayoutChangeEvent, TouchableOpacity, Text} from "react-native";
import i18n from "i18n-js";
import DropDownPicker from "react-native-dropdown-picker";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {Overlay} from "react-native-elements";
import {getPickerStyles} from "../styles/picker";

type PickerItem = {
    value: string;
    label: string;
};

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
    stateLocale: state.settings.locale,
}));

// Component props
export type MultiPickerProps = ConnectedProps<typeof reduxConnector> & {
    values: string[];
    genLabel?: (value: string) => string;
    onChange?: (values: string[]) => void;
    defaultValues?: string[];
    placeholder?: string;
    multipleText?: string;
    searchablePlaceholder?: string;
} & ViewProps;

// Component state
export type MultiPickerState = {
    items: PickerItem[];
    selected: string[];
    open: boolean;
    dropdownWrapperHeight: number;
};

class MultiPicker extends React.Component<MultiPickerProps, MultiPickerState> {
    static defaultProps = {
        items: [],
        defaultItems: [],
        defaultValues: [],
    };

    constructor(props: MultiPickerProps) {
        super(props);
        this.state = {
            items: [],
            open: false,
            dropdownWrapperHeight: 0,
            selected: props.defaultValues || [],
        };
    }

    updateItems() {
        const items = this.props.values.map((value: string) => ({
            value,
            label: this.props.genLabel ? i18n.t(this.props.genLabel(value)) : value,
        }));
        this.setState({...this.state, items});
    }

    componentDidMount() {
        this.updateItems();
    }

    componentDidUpdate(oldProps: MultiPickerProps) {
        if (oldProps.stateLocale != this.props.stateLocale || oldProps.values.length != this.state.items.length) {
            this.updateItems();
        }
    }

    open() {
        this.setState({...this.state, open: true});
    }

    close() {
        this.setState({...this.state, open: false});
    }

    render(): JSX.Element {
        const {theme, onChange, genLabel, placeholder, multipleText, searchablePlaceholder, ...viewProps} = this.props;

        const pickerStyles = getPickerStyles(theme);

        const selectedViews = this.state.selected.map((val: string, i: number) => (
            <View key={i} style={pickerStyles.selectedItemView}>
                <Text numberOfLines={1}>{genLabel ? i18n.t(genLabel(val)) : val}</Text>
            </View>
        ));

        return (
            <View {...viewProps}>
                {!this.state.open && (
                    <View>
                        <TouchableOpacity onPress={() => this.open()} style={pickerStyles.openButton}>
                            <Text style={pickerStyles.openButtonText}>
                                {i18n.t("picker.callToAction").replace("%d", this.state.selected.length.toString())}
                            </Text>
                        </TouchableOpacity>
                        <View>{selectedViews}</View>
                    </View>
                )}
                {this.state.open && (
                    <Overlay
                        overlayStyle={pickerStyles.overlay}
                        isVisible={this.state.open}
                        onRequestClose={() => this.close()}
                        onBackdropPress={() => this.close()}
                    >
                        <>
                            <View
                                style={pickerStyles.dropdownWrapper}
                                onLayout={(e: LayoutChangeEvent) => {
                                    this.setState({...this.state, dropdownWrapperHeight: e.nativeEvent.layout.height});
                                }}
                            >
                                <DropDownPicker
                                    items={this.state.items}
                                    multiple={true}
                                    searchable={true}
                                    defaultValue={this.state.selected}
                                    onChangeItem={(values: string[]) => {
                                        console.log(values);
                                        //const values = items.map((it: PickerItem) => it.value);
                                        this.setState({...this.state, selected: values});
                                        if (onChange) onChange(values);
                                    }}
                                    placeholder={placeholder}
                                    multipleText={multipleText}
                                    searchablePlaceholder={searchablePlaceholder}
                                    scrollViewProps={{keyboardShouldPersistTaps: "always"}} // ensures items are clickable even when the keyboard is open
                                    isVisible={true}
                                    showArrow={false}
                                    //arrowSize: 20,
                                    dropDownMaxHeight={this.state.dropdownWrapperHeight - 50}
                                    // Style props
                                    containerStyle={pickerStyles.dropdownContainerStyle}
                                    style={pickerStyles.dropdownStyle}
                                    itemStyle={pickerStyles.dropdownItemStyle}
                                    activeItemStyle={pickerStyles.dropdownActiveItemStyle}
                                    activeLabelStyle={pickerStyles.dropdownActiveLabelStyle}
                                    labelStyle={pickerStyles.dropdownLabelStyle}
                                />
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => this.close()} style={pickerStyles.okButton}>
                                    <Text style={pickerStyles.okButtonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    </Overlay>
                )}
            </View>
        );
    }
}

export default reduxConnector(MultiPicker);
