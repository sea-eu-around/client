import * as React from "react";
import {View, ViewProps, TouchableOpacity, Text, StyleSheet, Platform, LayoutChangeEvent} from "react-native";
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
import {styleTextLight, webFontFamily} from "../styles/general";
import Chips from "./Chips";

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
    locale: state.settings.userSettings.locale,
}));

// Component props
export type SectionedMultiPickerProps = ConnectedProps<typeof reduxConnector> & {
    values: SectionDescriptor[];
    genLabel?: (value: string) => string;
    genSectionLabel?: (id: string) => string;
    onChange?: (values: string[]) => void;
    selected?: string[];
    searchablePlaceholder?: string;
    showChips?: boolean;
} & ViewProps &
    ThemeProps;

// Component state
export type SectionedMultiPickerState = {
    items: Map<SupportedLocale, PickerItemSection[]>;
    open: boolean;
    tempSelected: string[];
    width: number;
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
            width: 0,
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
        if (this.state.open && this.selectRef.current) this.selectRef.current._toggleSelector();
        this.setState({
            ...this.state,
            open: false,
            tempSelected: apply ? this.state.tempSelected : this.props.selected || [],
        });
        if (apply) this.apply(this.state.tempSelected);
    }

    apply(items: string[]) {
        if (this.props.onChange) this.props.onChange(items);
    }

    render(): JSX.Element {
        const {
            theme,
            locale,
            selected,
            genLabel,
            searchablePlaceholder,
            showChips,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onChange,
            ...viewProps
        } = this.props;
        const {tempSelected, width} = this.state;
        const styles = pickerStyles(theme);
        const multiSelectStyles = sectionedMultiSelectStyles(theme);
        const miscStyles = themedStyles(theme);

        const selectedItems = selected || [];

        const select = this.state.items.get(locale) ? (
            <SectionedMultiSelect
                ref={this.selectRef}
                items={this.state.items.get(locale)}
                onSelectedItemsChange={(items) =>
                    this.setState({...this.state, tempSelected: (items as unknown) as string[]})
                }
                selectedItems={tempSelected}
                uniqueKey="id"
                displayKey="label"
                subKey="children"
                // Listeners
                onCancel={() => this.close(false)}
                onConfirm={() => this.close(true)}
                // Dirty work-arounds to get the typing to work. This is due to a mistake in react-native-sectioned-multi-select
                IconRenderer={(MaterialIcons as unknown) as JSX.Element}
                icons={undefined as never}
                // Customization
                showDropDowns={true}
                readOnlyHeadings={true}
                showChips={false}
                showCancelButton={true}
                selectedIconOnLeft={true}
                animateDropDowns={false}
                hideSelect={true}
                noResultsComponent={<Text style={miscStyles.noResultsText}>{i18n.t("noResultsFound")}</Text>}
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
                confirmFontFamily={webFontFamily}
                itemFontFamily={webFontFamily}
                searchTextFontFamily={webFontFamily}
                subItemFontFamily={webFontFamily}
                styles={{
                    ...multiSelectStyles,
                    ...(Platform.OS === "web"
                        ? {
                              modalWrapper: {width},
                              container: [multiSelectStyles.container, {width}],
                          }
                        : {}),
                }}
            />
        ) : (
            <></>
        );

        return (
            <View
                {...viewProps}
                style={{position: "relative"}}
                onLayout={(e: LayoutChangeEvent) => this.setState({...this.state, width: e.nativeEvent.layout.width})}
            >
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
                                const selected = this.state.tempSelected.filter((v) => v !== item);
                                this.setState({...this.state, tempSelected: selected});
                                this.apply(selected);
                            }}
                        />
                    )}
                </View>
                {(Platform.OS === "android" || Platform.OS === "ios") && <View>{select}</View>}
                {Platform.OS === "web" && this.state.open && select}
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
        container: {
            backgroundColor: theme.cardBackground,
            ...(Platform.OS === "web"
                ? {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      position: "fixed" as any,
                      top: 50,
                      bottom: 50,
                      alignSelf: "center",
                      borderWidth: 0,
                      maxWidth: 700,
                      maxHeight: 600,
                      boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.1)",
                  }
                : {}),
        },
        scrollView: {paddingVertical: 10, ...(Platform.OS === "web" ? {overflowY: "auto"} : {})},
        searchBar: {backgroundColor: theme.background},
        searchTextInput: {color: theme.text},
        toggleIcon: {backgroundColor: theme.cardBackground},
        subItem: {
            borderRadius: 4,
            marginVertical: 2,
        },
        selectedItem: {backgroundColor: theme.background},
        itemText: {
            ...styleTextLight,
            letterSpacing: 1.5,
            fontSize: 14,
            lineHeight: 18,
            textTransform: "uppercase",
        },
        subItemText: {
            marginLeft: 5,
        },
        separator: {marginVertical: 8},
    });
});

export default reduxConnector(withTheme(SectionedMultiPicker));
