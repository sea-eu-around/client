import {useBottomSheet} from "@gorhom/bottom-sheet";
import {BottomSheetDefaultBackdropProps} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import React, {memo, useCallback, useMemo, useRef} from "react";
import {Dimensions, TouchableWithoutFeedback, View} from "react-native";
import Animated, {and, call, cond, eq, Extrapolate, neq, not, set, interpolate} from "react-native-reanimated";
import {useValue} from "react-native-redash";
import {isEqual} from "lodash";

/* Copied from origin repo :
 * https://github.com/gorhom/react-native-bottom-sheet/blob/master/src/components/bottomSheetBackdrop/BottomSheetBackdrop.tsx
 * Added a small tweak to opacity calculation
 */

const DEFAULT_OPACITY = 0.5;
const DEFAULT_DISAPPEARS_ON_INDEX = 0;
const DEFAULT_ENABLE_TOUCH_THROUGH = false;
const DEFAULT_CLOSE_ON_PRESS = true;
const WINDOW_HEIGHT = Dimensions.get("window").height;

type CustomBackdropProps = {firstSnapPoint: number} & BottomSheetDefaultBackdropProps;

const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(TouchableWithoutFeedback);

const BottomSheetBackdropComponent = ({
    animatedIndex,
    animatedPosition,
    opacity = DEFAULT_OPACITY,
    disappearsOnIndex = DEFAULT_DISAPPEARS_ON_INDEX,
    enableTouchThrough = DEFAULT_ENABLE_TOUCH_THROUGH,
    closeOnPress = DEFAULT_CLOSE_ON_PRESS,
    style,
    firstSnapPoint,
}: CustomBackdropProps): JSX.Element => {
    //#region hooks
    const {close} = useBottomSheet();
    //#endregion

    //#region variables
    const containerRef = useRef<Animated.View>(null);
    const pointerEvents = useMemo(() => (enableTouchThrough ? "none" : "auto"), [enableTouchThrough]);
    //#endregion

    //#region animation variables
    const isTouchable = useValue(closeOnPress !== undefined ? 1 : 0);

    // ORIGINAL CODE
    /*const animatedOpacity = useMemo(
        () =>
            interpolate(animatedIndex, {
                inputRange: [disappearsOnIndex, appearsOnIndex],
                outputRange: [0, opacity],
                extrapolate: Extrapolate.CLAMP,
            }),
        [animatedIndex, opacity, appearsOnIndex, disappearsOnIndex],
    );*/
    // REPLACEMENT
    const animatedOpacity = useMemo(
        () =>
            interpolate(animatedPosition, {
                inputRange: [0, firstSnapPoint],
                outputRange: [0, opacity],
                extrapolate: Extrapolate.CLAMP,
            }),
        [animatedPosition, opacity, firstSnapPoint],
    );

    //#endregion

    //#region callbacks
    const handleOnPress = useCallback(() => {
        close();
    }, [close]);
    //#endregion

    //#region styles
    const buttonStyle = useMemo(() => [style, {top: cond(eq(animatedIndex, disappearsOnIndex), WINDOW_HEIGHT, 0)}], [
        disappearsOnIndex,
        style,
        animatedIndex,
    ]);
    const containerStyle = useMemo(() => [{backgroundColor: "black"}, style, {opacity: animatedOpacity}], [
        style,
        animatedOpacity,
    ]);

    //#endregion
    return closeOnPress ? (
        <>
            <AnimatedTouchableWithoutFeedback
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Bottom Sheet backdrop"
                accessibilityHint="Tap to close the Bottom Sheet"
                onPress={handleOnPress}
                style={buttonStyle}
            >
                <Animated.View ref={containerRef} style={containerStyle} />
            </AnimatedTouchableWithoutFeedback>
            <Animated.Code>
                {() =>
                    cond(
                        and(eq(animatedPosition, disappearsOnIndex), isTouchable),
                        [
                            set(isTouchable, 0),
                            call([], () => setAnimatedViewNativeProps(containerRef, {pointerEvents: "none"})), // SAME CODE BUT CLEANED-UP
                        ],
                        cond(and(neq(animatedPosition, disappearsOnIndex), not(isTouchable)), [
                            set(isTouchable, 1),
                            call([], () => setAnimatedViewNativeProps(containerRef, {pointerEvents: "auto"})), // SAME CODE BUT CLEANED-UP
                        ]),
                    )
                }
            </Animated.Code>
        </>
    ) : (
        <Animated.View pointerEvents={pointerEvents} style={containerStyle} />
    );
};

/* Calls setNativeProps an Animated.View ref without breaking TS typing */
function setAnimatedViewNativeProps(ref: React.RefObject<Animated.View>, props: Record<string, unknown>): void {
    if (ref.current) ((ref.current as unknown) as View).setNativeProps(props);
}

const BottomSheetBackdrop = memo(BottomSheetBackdropComponent, isEqual);

export default BottomSheetBackdrop;
