import * as React from "react";

import {Text, TextProps} from "react-native";

export function MonoText(props: TextProps): JSX.Element {
    return <Text {...props} style={[props.style, {fontFamily: "space-mono"}]} />;
}
