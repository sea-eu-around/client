import * as React from "react";
import {useFocusEffect} from "@react-navigation/native";

export default function FocusAware({onFocus, onBlur}: {onFocus?: () => void; onBlur?: () => void}): JSX.Element {
    useFocusEffect(
        React.useCallback(() => {
            if (onFocus) onFocus();
            return () => {
                if (onBlur) onBlur();
            };
        }, []),
    );
    return <></>;
}
