import {MaterialCommunityIcons} from "@expo/vector-icons";
import * as React from "react";
import ReAnimated, {Easing} from "react-native-reanimated";
import {StyleProp, TextStyle, View, ViewStyle} from "react-native";
import {useFocusEffect} from "@react-navigation/native";

const ANIMATION_AMPLITUDE = 25;
const DURATION = 400; // the animation duration (ms)
const PAUSE = 1000; // how much time to wait before looping the animation (ms)

// Component props
export type SwipeTipProps = {direction: "horizontal"; style?: StyleProp<ViewStyle>; iconStyle?: StyleProp<TextStyle>};

// Component props
export type SwipeTipState = {animating: boolean};

function FocusAware({onFocus, onBlur}: {onFocus?: () => void; onBlur?: () => void}) {
    useFocusEffect(
        React.useCallback(() => {
            if (onFocus) onFocus();
            return () => {
                if (onBlur) onBlur();
            };
        }, []),
    );
    return null;
}

class SwipeTip extends React.Component<SwipeTipProps, SwipeTipState> {
    offset = new ReAnimated.Value(0);

    constructor(props: SwipeTipProps) {
        super(props);
        this.state = {animating: false};
    }

    setAnimating(b: boolean): void {
        if (b === this.state.animating) return;

        this.setState({...this.state, animating: b});

        if (b) {
            const animate = (even: boolean): void => {
                ReAnimated.timing(this.offset, {
                    toValue: even ? ANIMATION_AMPLITUDE / 2 : -ANIMATION_AMPLITUDE / 2,
                    duration: DURATION,
                    easing: Easing.inOut(Easing.circle),
                }).start(() => {
                    // Come back to initial position
                    ReAnimated.timing(this.offset, {
                        toValue: 0,
                        duration: DURATION,
                        easing: Easing.linear,
                    }).start(() => {
                        // Pause before animating again
                        if (this.state.animating) {
                            if (even) setTimeout(() => animate(!even), PAUSE);
                            else animate(!even);
                        }
                    });
                });
            };
            animate(true);
        }
    }

    render(): JSX.Element {
        const {direction, style, iconStyle} = this.props;

        const iconName = direction === "horizontal" ? "gesture-swipe-horizontal" : undefined;

        return (
            <View style={[style]}>
                <FocusAware onFocus={() => this.setAnimating(true)} onBlur={() => this.setAnimating(false)} />
                <ReAnimated.View style={{left: this.offset}}>
                    {iconName && <MaterialCommunityIcons name={iconName} style={iconStyle} />}
                </ReAnimated.View>
            </View>
        );
    }
}

export default SwipeTip;
