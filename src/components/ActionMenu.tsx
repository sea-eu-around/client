import * as React from "react";
import {StyleSheet, StyleProp, ViewStyle, TextStyle} from "react-native";
import {ListItem, withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {ThemeProps} from "../types";
import i18n from "i18n-js";
import BottomSheet, {BottomSheetClass} from "./bottom-sheet/BottomSheet";
import BottomSheetTouchableOpacity from "./bottom-sheet/BottomSheetTouchableOpacity";
import themes from "../constants/themes";

export type ActionMenuItemPreset = "close";

export type ActionMenuItem = {
    preset?: ActionMenuItemPreset;
    text?: string;
    icon?: (style: StyleProp<TextStyle>) => JSX.Element;
    onSelect?: () => void;
    persistMenu?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    noChevron?: boolean;
};

export type ActionMenuProps = {
    activator?: (show: () => void) => JSX.Element;
    title?: string;
    actions: ActionMenuItem[];
    snapPoints?: number[];
} & ThemeProps;

const ITEM_HEIGHT = 55;

export class ActionMenuClass extends React.Component<ActionMenuProps> {
    sheetRef = React.createRef<BottomSheetClass>();

    private getPreset(preset: ActionMenuItemPreset): ActionMenuItem {
        const {theme} = this.props;

        switch (preset) {
            case "close": {
                return {
                    text: i18n.t("close"),
                    containerStyle: {backgroundColor: theme.cardBackground},
                    textStyle: {color: theme.text},
                    noChevron: true,
                };
            }
        }
    }

    show(): void {
        this.sheetRef.current?.show();
    }

    render(): JSX.Element {
        const {theme, activator, title, actions, snapPoints} = this.props;

        const styles = themedStyles(theme);

        return (
            <>
                <BottomSheet
                    ref={this.sheetRef}
                    activator={activator}
                    snapPoints={snapPoints || [0, (1 + actions.length) * ITEM_HEIGHT]}
                    renderContent={(hide) => (
                        <>
                            {title && (
                                <ListItem bottomDivider style={styles.listItemContainer}>
                                    <ListItem.Content>
                                        <ListItem.Title style={styles.titleItem}>{title}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            )}
                            {actions.map((item, i) => {
                                const it = {
                                    ...(item.preset ? this.getPreset(item.preset) : {}),
                                    ...item,
                                };
                                return (
                                    <BottomSheetTouchableOpacity
                                        key={`menu-action-${i}`}
                                        onPress={() => {
                                            if (it.onSelect) it.onSelect();
                                            if (!it.persistMenu) hide();
                                        }}
                                        style={styles.listItemWrapper}
                                    >
                                        <ListItem containerStyle={[styles.listItemContainer, it.containerStyle]}>
                                            {!it.noChevron && <ListItem.Chevron />}
                                            {it.icon && it.icon([it.textStyle, {fontSize: 26}])}
                                            <ListItem.Content>
                                                <ListItem.Title style={it.textStyle}>{it.text}</ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                    </BottomSheetTouchableOpacity>
                                );
                            })}
                        </>
                    )}
                />
            </>
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        listItemWrapper: {
            width: "100%",
            height: ITEM_HEIGHT,
        },
        listItemContainer: {
            width: "100%",
            height: ITEM_HEIGHT,
        },
        titleItem: {
            fontSize: 26,
            color: themes.light.text,
        },
    });
});

export default withTheme(ActionMenuClass);
