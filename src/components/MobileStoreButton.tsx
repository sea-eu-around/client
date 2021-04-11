import React from "react";
import {Linking, StyleProp, TouchableOpacity, TouchableOpacityProps, ViewStyle} from "react-native";
import {getLocalSvg} from "../assets";
import LocalImage from "./LocalImage";

type MobileStoreButtonProps = {
    url: string;
    store: "ios" | "android";
    scale?: number;
    width?: number;
    linkStyle?: StyleProp<ViewStyle>;
    linkProps?: TouchableOpacityProps;
};

const DEFAULT_WIDTH = 204;
const DEFAULT_HEIGHT = 60;

class MobileStoreButton extends React.Component<MobileStoreButtonProps> {
    render(): JSX.Element {
        const {store, url, linkStyle, linkProps} = this.props;

        const Svg = store === "ios" ? getLocalSvg("store-button.ios", () => this.forceUpdate()) : null;
        const scale = this.props.scale === undefined ? 1 : this.props.scale;
        const width = this.props.width === undefined ? DEFAULT_WIDTH * scale : this.props.width * scale;
        const height = (width * DEFAULT_HEIGHT) / DEFAULT_WIDTH;

        return (
            <TouchableOpacity
                style={[
                    {
                        overflow: "hidden",
                        height,
                        width,
                        margin: 10,
                    },
                    linkProps ? linkProps.style : {},
                    linkStyle,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                    Linking.openURL(url);
                }}
                {...linkProps}
            >
                {store === "android" && (
                    <LocalImage imageKey="store-button.android" style={{width: "100%", height: "100%"}} />
                )}
                {store === "ios" && Svg && <Svg viewBox="0 0 133 40" width={width} height={height} fill="black" />}
            </TouchableOpacity>
        );
    }
}

export default MobileStoreButton;
