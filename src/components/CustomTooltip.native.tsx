import React from "react";
import {Text, StyleSheet} from "react-native";
import {Tooltip, withTheme} from "react-native-elements";
import themes from "../constants/themes";
import {preTheme} from "../styles/utils";
import {ThemeProps} from "../types";

// Component props
export type CustomTooltipProps = {
    text: string;
} & ThemeProps;

// Component state
type CustomTooltipState = {
    height: number | undefined;
};

class CustomTooltip extends React.Component<CustomTooltipProps, CustomTooltipState> {
    constructor(props: CustomTooltipProps) {
        super(props);
        this.state = {height: undefined};
    }

    render(): JSX.Element {
        const {height} = this.state;
        const {theme, text} = this.props;
        const styles = tooltipStyles(theme);

        return (
            <Tooltip
                popover={
                    <Text
                        style={styles.text}
                        onLayout={(e) => {
                            this.setState({
                                ...this.state,
                                height: e.nativeEvent.layout.height,
                            });
                        }}
                    >
                        {text}
                    </Text>
                }
                backgroundColor={theme.accentSlight}
                containerStyle={styles.container}
                width={250}
                height={height}
            >
                {this.props.children}
            </Tooltip>
        );
    }
}

export const tooltipStyles = preTheme(() => {
    return StyleSheet.create({
        text: {
            textAlign: "justify",
            paddingVertical: 10,
            fontSize: 14,
            color: themes.light.text,
        },
        container: {
            alignContent: "center",
            borderRadius: 4,
            paddingHorizontal: 10,
        },
    });
});

export default withTheme(CustomTooltip);
