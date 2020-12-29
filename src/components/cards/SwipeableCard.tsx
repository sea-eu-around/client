import * as React from "react";
import {
    TouchableOpacity,
    View,
    ViewStyle,
    StyleSheet,
    Platform,
    StyleProp,
    Dimensions,
    Text,
    ViewProps,
} from "react-native";
import {withTheme} from "react-native-elements";
import ReAnimated, {Easing} from "react-native-reanimated";
import Swipeable, {SwipeableProperties} from "react-native-gesture-handler/Swipeable";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {styleTextThin} from "../../styles/general";
import {MaterialIcons} from "@expo/vector-icons";

// Theses style elements are defined this way because they have to be set in very specific ways
type SwipeableLooks = {
    sideMargin: number;
    borderRadius: number;
    verticalSpacing: number;
    minHeight: number;
};

const DEFAULT_LOOKS: SwipeableLooks = {
    sideMargin: 15,
    borderRadius: 10,
    verticalSpacing: 8,
    minHeight: 150,
};

// Component props
export type SwipeableCardProps = ThemeProps &
    SwipeableProperties & {
        style?: ViewStyle;
        onHidden?: () => void;
        onPress?: () => void;
        looks?: Partial<SwipeableLooks>;
        leftActions?: (hideCard: (noAnimation?: boolean) => void) => JSX.Element;
        rightActions?: (hideCard: (noAnimation?: boolean) => void) => JSX.Element;
        wrapperProps?: ViewProps;
    };

// Component state
export type SwipeableCardState = {
    minHeight: ReAnimated.Value<number>;
    right: ReAnimated.Value<number>;
    hidden: boolean;
};

export class SwipeableCardClass extends React.Component<SwipeableCardProps, SwipeableCardState> {
    constructor(props: SwipeableCardProps) {
        super(props);

        const {minHeight} = {...DEFAULT_LOOKS, ...props.looks};

        this.state = {
            minHeight: new ReAnimated.Value(minHeight),
            right: new ReAnimated.Value(0),
            hidden: false,
        };
    }

    hide(): void {
        this.setState({...this.state, hidden: true});
        if (this.props.onHidden) this.props.onHidden();
    }

    collapse(onFinish?: () => void, right?: boolean): void {
        const duration = 200;
        ReAnimated.timing(this.state.right, {
            toValue: (right ? -1 : 1) * Dimensions.get("window").width * 1.5,
            duration,
            easing: Easing.ease,
        }).start();
        setTimeout(() => {
            if (onFinish) onFinish();
            this.hide();
        }, duration);
    }

    render(): JSX.Element {
        const {
            theme,
            children,
            leftActions,
            rightActions,
            style,
            looks,
            onPress,
            wrapperProps,
            ...swipeableProps
        } = this.props;
        const {minHeight, right, hidden} = this.state;
        const styles = themedStyles(theme);

        const {borderRadius, sideMargin, verticalSpacing} = {...DEFAULT_LOOKS, ...looks};
        const hideCard = (noAnimation?: boolean) => {
            if (noAnimation) this.hide();
            else this.collapse();
        };

        return (
            // Use flexBasis, acting as minHeight
            <ReAnimated.View
                style={[styles.wrapper, style, {flexBasis: minHeight, right}, hidden ? {display: "none"} : {}]}
                {...wrapperProps}
            >
                <ReAnimated.View style={{}}>
                    <Swipeable
                        containerStyle={[
                            styles.swipeableContainer,
                            {paddingHorizontal: sideMargin, paddingVertical: verticalSpacing},
                        ]}
                        childrenContainerStyle={[styles.swipeable, {borderRadius}]}
                        useNativeAnimations={Platform.OS !== "web"}
                        friction={1}
                        renderLeftActions={leftActions ? () => leftActions(hideCard) : swipeableProps.renderLeftActions}
                        renderRightActions={
                            rightActions ? () => rightActions(hideCard) : swipeableProps.renderRightActions
                        }
                        {...swipeableProps}
                    >
                        <TouchableOpacity activeOpacity={0.75} style={styles.touchable} onPress={onPress}>
                            {children}
                        </TouchableOpacity>
                    </Swipeable>
                </ReAnimated.View>
            </ReAnimated.View>
        );
    }
}

export type SwipeActionProps = {
    icon?: string;
    text?: string;
    backgroundColor?: string;
    color?: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
};

const oneSidedBorderRadius = (side: "left" | "right", borderRadius: number) => {
    return side === "left"
        ? {borderTopLeftRadius: borderRadius, borderBottomLeftRadius: borderRadius}
        : {borderTopRightRadius: borderRadius, borderBottomRightRadius: borderRadius};
};

const SwipeActionButton = withTheme(
    (props: SwipeActionProps & ThemeProps): JSX.Element => {
        const {icon, text, backgroundColor, onPress, style, theme} = props;
        const styles = buttonStyles(theme);
        const color = props.color || theme.textWhite;

        return (
            <TouchableOpacity onPress={onPress} style={[styles.swipeActionButton, {backgroundColor}, style]}>
                {icon && <MaterialIcons style={[styles.swipeActionButtonIcon, {color}]} name={icon} />}
                {text && <Text style={[styles.swipeActionButtonText, {color}]}>{text}</Text>}
            </TouchableOpacity>
        );
    },
);

type SwipeActionsProps = ThemeProps & {
    id: string;
    side: "left" | "right";
    actions: SwipeActionProps[];
    looks?: Partial<SwipeableLooks>;
};

export const SwipeActionButtons = withTheme(
    (props: React.PropsWithChildren<SwipeActionsProps>): JSX.Element => {
        const {id, actions, side, looks} = props;

        const {borderRadius} = {...DEFAULT_LOOKS, ...looks};

        return (
            <SwipeActionContainer side={side} looks={looks} contentStyle={{aspectRatio: actions.length}}>
                {actions.map((properties: SwipeActionProps, i: number) => {
                    const first = i === 0;
                    const last = i === actions.length - 1;
                    const isExteriorButton = (first && side === "left") || (last && side === "right");
                    const isInteriorButton = (first && side === "right") || (last && side === "left");
                    const {backgroundColor} = properties;

                    // Add a small view to fill the empty area created by the card's border radius
                    const interiorFiller = isInteriorButton ? (
                        <View
                            style={{
                                width: borderRadius,
                                height: "100%",
                                position: "absolute",
                                top: 0,
                                ...(side === "left" ? {right: -borderRadius} : {left: -borderRadius}),
                                backgroundColor,
                            }}
                        />
                    ) : undefined;

                    return (
                        <React.Fragment key={`swipe-actions-${id}-${side}-${i}`}>
                            {isInteriorButton && interiorFiller}
                            <SwipeActionButton
                                style={isExteriorButton ? oneSidedBorderRadius(side, borderRadius) : {}}
                                {...properties}
                            />
                        </React.Fragment>
                    );
                })}
            </SwipeActionContainer>
        );
    },
);

type SwipeActionContainerProps = ThemeProps & {
    side: "left" | "right";
    looks?: Partial<SwipeableLooks>;
    contentStyle?: StyleProp<ViewStyle>;
    fullCardWidth?: boolean;
};

export const SwipeActionContainer = withTheme(
    (props: React.PropsWithChildren<SwipeActionContainerProps>): JSX.Element => {
        const {side, looks, fullCardWidth, contentStyle, theme} = props;
        const styles = buttonStyles(theme);

        const {borderRadius, sideMargin, verticalSpacing} = {...DEFAULT_LOOKS, ...looks};

        return (
            <View
                style={[
                    styles.swipeActionsContainer,
                    {paddingVertical: verticalSpacing},
                    side === "left"
                        ? {
                              marginLeft: sideMargin,
                              marginRight: -sideMargin,
                              justifyContent: "flex-start",
                          }
                        : {
                              marginLeft: -sideMargin,
                              marginRight: sideMargin,
                              justifyContent: "flex-end",
                          },
                    fullCardWidth
                        ? {
                              width: "100%",
                              marginHorizontal: sideMargin,
                              ...(side === "left" ? {paddingRight: sideMargin * 2} : {paddingLeft: sideMargin * 2}),
                          }
                        : {},
                ]}
            >
                <View
                    style={[
                        styles.swipeActionsContent,
                        fullCardWidth ? {borderRadius} : oneSidedBorderRadius(side, borderRadius),
                        contentStyle,
                    ]}
                >
                    {props.children}
                </View>
            </View>
        );
    },
);

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            width: "100%",
            overflow: "hidden",
        },
        swipeableContainer: {
            width: "100%",
        },
        swipeable: {
            width: "100%",
            overflow: "hidden",
            backgroundColor: theme.cardBackground,
        },
        touchable: {
            width: "100%",
            height: "100%",
            overflow: "hidden",
        },
    });
});

const buttonStyles = preTheme(() => {
    return StyleSheet.create({
        swipeActionsContainer: {
            height: "100%",
        },
        swipeActionsContent: {
            justifyContent: "flex-start",
            flexDirection: "row",
            height: "100%",
        },
        swipeActionButton: {
            justifyContent: "center",
            alignItems: "center",
            aspectRatio: 1,
        },
        swipeActionButtonIcon: {
            fontSize: 22,
        },
        swipeActionButtonText: {
            fontSize: 16,
        },
        swipeActionText: {
            fontSize: 24,
            letterSpacing: 2,
            ...styleTextThin,
        },
    });
});

export default withTheme(SwipeableCardClass);
