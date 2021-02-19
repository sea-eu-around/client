import * as React from "react";
import {TouchableOpacity, TouchableOpacityProps} from "react-native";

export default class BottomSheetTouchableOpacity extends React.Component<TouchableOpacityProps> {
    render(): JSX.Element {
        return <TouchableOpacity {...this.props}>{this.props.children}</TouchableOpacity>;
    }
}
