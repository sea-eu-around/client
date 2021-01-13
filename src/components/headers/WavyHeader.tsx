import React from "react";
import {StyleProp, View, ViewStyle} from "react-native";
import Wave from "../Wave";

export type WavyHeaderProps = {
    style?: StyleProp<ViewStyle>;
    color: string;
    wavePatternIndex?: number | "random";
    upsideDown?: boolean;
};

type WavyHeaderState = {
    headerWidth: number;
    waveTop: number;
};

export default class WavyHeader extends React.Component<WavyHeaderProps, WavyHeaderState> {
    constructor(props: WavyHeaderProps) {
        super(props);
        this.state = {
            headerWidth: 0,
            waveTop: props.upsideDown ? 1 : -1,
        };
    }

    render(): JSX.Element {
        const {style, color, upsideDown, children, wavePatternIndex} = this.props;
        const {headerWidth, waveTop} = this.state;

        return (
            <>
                <View
                    style={[{backgroundColor: color, width: "100%", zIndex: 10}, style]}
                    onLayout={(layout) => {
                        const {y, height, width} = layout.nativeEvent.layout;
                        this.setState({...this.state, headerWidth: width, waveTop: y + height});
                    }}
                >
                    {children}
                </View>
                {waveTop !== -1 && (
                    <Wave
                        style={{
                            position: "absolute",
                            top: waveTop + (upsideDown ? 1 : -1),
                            width: headerWidth,
                            zIndex: 10,
                        }}
                        color={color}
                        patternIndex={wavePatternIndex || "random"}
                        upsideDown={upsideDown}
                    />
                )}
            </>
        );
    }
}
