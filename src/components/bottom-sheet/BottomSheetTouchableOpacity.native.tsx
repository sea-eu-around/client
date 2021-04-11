import * as React from "react";
import {TouchableOpacityProps} from "react-native";
import {TouchableOpacity} from "@gorhom/bottom-sheet";

export default class BottomSheetTouchableOpacity extends React.Component<TouchableOpacityProps> {
    render(): JSX.Element {
        return <TouchableOpacity {...this.props}>{this.props.children}</TouchableOpacity>;
    }
}
