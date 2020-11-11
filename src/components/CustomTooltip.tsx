import React from "react";
import {Text} from "react-native";
import {Tooltip, withTheme} from "react-native-elements";
import {tooltipStyles} from "../styles/tooltips";
import {ThemeProps} from "../types";

// Component props
export type CustomTooltipProps = {
    text: string;
} & ThemeProps;

// Component state
export type CustomTooltipState = {
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
                height={height}
            >
                {this.props.children}
            </Tooltip>
        );
    }
}

export default withTheme(CustomTooltip);
