import * as React from "react";
import {View, ViewProps, TouchableOpacity, Text, StyleSheet} from "react-native";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {withTheme} from "react-native-elements";
import {pickerStyles} from "../styles/picker";
import {Theme, ThemeProps} from "../types";
import {SupportedLocale} from "../localization";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import {preTheme} from "../styles/utils";
import {MaterialIcons} from "@expo/vector-icons";

type PickerItem = {
    id: string;
    label: string;
};

type PickerItemSection = {
    id: string;
    label: string;
    children: PickerItem[];
};

type SectionDescriptor = {id: string; items: string[]};

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    locale: state.settings.locale,
}));

// Component props
export type SectionedMultiPickerProps = ConnectedProps<typeof reduxConnector> & {
    values: SectionDescriptor[];
    genLabel?: (value: string) => string;
    genSectionLabel?: (id: string) => string;
    onChange?: (values: string[]) => void;
    selected?: string[];
    searchablePlaceholder?: string;
    showSelected?: boolean;
} & ViewProps &
    ThemeProps;

// Component state
export type SectionedMultiPickerState = {
    items: Map<SupportedLocale, PickerItemSection[]>;
    open: boolean;
    tempSelected: string[];
};

class SectionedMultiPicker extends React.Component<SectionedMultiPickerProps, SectionedMultiPickerState> {
    static defaultProps = {
        items: [],
        showSelected: true,
        selected: [],
    };

    selectRef: React.RefObject<SectionedMultiSelect<PickerItem>>;

    constructor(props: SectionedMultiPickerProps) {
        super(props);
        this.selectRef = React.createRef<SectionedMultiSelect<PickerItem>>();
        this.state = {
            items: new Map(),
            open: false,
            tempSelected: props.selected || [],
        };
    }

    updateItems() {
        const locale = this.props.locale;
        if (!this.state.items.has(locale) || this.state.items.get(locale)?.length != this.props.values.length) {
            const items = new Map(this.state.items);
            items.set(
                locale,
                this.props.values.map((section: SectionDescriptor) => ({
                    id: section.id,
                    label: this.props.genSectionLabel ? i18n.t(this.props.genSectionLabel(section.id)) : section.id,
                    children: section.items.map((value: string) => ({
                        id: value,
                        label: this.props.genLabel ? i18n.t(this.props.genLabel(value)) : value,
                    })),
                })),
            );
            this.setState({...this.state, items});
        }
    }

    componentDidMount() {
        this.updateItems();
    }

    componentDidUpdate(oldProps: SectionedMultiPickerProps) {
        if (oldProps.locale != this.props.locale || oldProps.values.length != this.props.values.length) {
            this.updateItems();
        }
    }

    open() {
        if (this.selectRef.current) this.selectRef.current._toggleSelector();
        this.setState({...this.state, open: true, tempSelected: this.props.selected || this.state.tempSelected});
    }

    close(apply: boolean) {
        this.setState({
            ...this.state,
            open: false,
            tempSelected: apply ? this.state.tempSelected : this.props.selected || [],
        });
        if (this.selectRef.current) this.selectRef.current._toggleSelector();
        if (apply && this.props.onChange) this.props.onChange(this.state.tempSelected);
    }

    render(): JSX.Element {
        const {
            theme,
            locale,
            selected,
            genLabel,
            searchablePlaceholder,
            showSelected,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onChange,
            ...viewProps
        } = this.props;
        const styles = pickerStyles(theme);
        const multiSelectStyles = sectionedMultiSelectStyles(theme);
        const miscStyles = themedStyles(theme);

        const selectedItems = selected || [];

        return (
            <View {...viewProps}>
                <View>
                    <TouchableOpacity onPress={() => this.open()} style={styles.openButton}>
                        <Text style={styles.openButtonText}>
                            {i18n.t("picker.callToAction").replace("%d", selectedItems.length.toString())}
                        </Text>
                    </TouchableOpacity>
                    <View>
                        {showSelected &&
                            selectedItems.map((val: string, i: number) => (
                                <View key={i} style={styles.selectedItemView}>
                                    <Text style={styles.selectedItemText} numberOfLines={1}>
                                        {genLabel ? i18n.t(genLabel(val)) : val}
                                    </Text>
                                </View>
                            ))}
                    </View>
                </View>
                <View /*style={{height: 0, overflow: "hidden"}}*/>
                    {this.state.items.get(locale) && (
                        <SectionedMultiSelect
                            ref={this.selectRef}
                            items={this.state.items.get(locale)}
                            onSelectedItemsChange={(items) =>
                                this.setState({...this.state, tempSelected: (items as unknown) as string[]})
                            }
                            selectedItems={this.state.tempSelected}
                            // Listeners
                            onCancel={() => this.close(false)}
                            onConfirm={() => this.close(true)}
                            // Technical
                            // Dirty work-around to get the typing to work. This is due to a mistake in react-native-sectioned-multi-select
                            IconRenderer={(MaterialIcons as unknown) as JSX.Element}
                            uniqueKey="id"
                            displayKey="label"
                            subKey="children"
                            // Customization
                            showDropDowns={true}
                            readOnlyHeadings={true}
                            showChips={false}
                            showCancelButton={true}
                            selectedIconOnLeft={true}
                            animateDropDowns={false}
                            hideSelect={true}
                            noResultsComponent={
                                <Text style={miscStyles.noResultsText}>{i18n.t("noResultsFound")}</Text>
                            }
                            searchIconComponent={<MaterialIcons name="search" style={miscStyles.searchIcon} />}
                            // Localization
                            confirmText={i18n.t("apply")}
                            searchPlaceholderText={searchablePlaceholder}
                            // Styling
                            colors={{
                                primary: theme.accent,
                                cancel: theme.error,
                                success: theme.okay,
                                text: theme.text,
                                subText: theme.textLight,
                                searchPlaceholderTextColor: theme.textLight,
                                selectToggleTextColor: theme.error,
                                itemBackground: theme.cardBackground,
                                subItemBackground: theme.cardBackground,
                            }}
                            styles={multiSelectStyles}
                        />
                    )}
                </View>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        noResultsText: {
            textAlign: "center",
            color: theme.text,
            fontSize: 16,
            marginVertical: 20,
        },
        searchIcon: {
            fontSize: 26,
            marginHorizontal: 10,
            color: theme.textLight,
        },
    });
});

const sectionedMultiSelectStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {backgroundColor: theme.cardBackground},
        scrollView: {paddingVertical: 10},
        searchBar: {backgroundColor: theme.background},
        searchTextInput: {color: theme.text},
        toggleIcon: {backgroundColor: theme.cardBackground},
        subItem: {
            borderRadius: 4,
            marginVertical: 2,
        },
        selectedItem: {backgroundColor: theme.background},
        itemText: {
            fontFamily: "sans-serif-light",
            fontWeight: "normal",
            letterSpacing: 1.5,
            fontSize: 14,
            lineHeight: 18,
            textTransform: "uppercase",
        },
        separator: {marginVertical: 8},
    });
});

export default reduxConnector(withTheme(SectionedMultiPicker));
