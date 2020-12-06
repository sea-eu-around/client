import * as React from "react";
import {ActivityIndicator, StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";

// Component props
export type AsyncButtonProps = {
    onPress: () => Promise<unknown>;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    loadingIndicatorStyle?: StyleProp<ViewStyle>;
    color?: string;
    text: string;
} & ThemeProps;

// Component state
type AsyncButtonState = {
    loading: boolean;
};

class AsyncButton extends React.Component<AsyncButtonProps, AsyncButtonState> {
    constructor(props: AsyncButtonProps) {
        super(props);
        this.state = {loading: false};
    }

    onPress() {
        if (!this.state.loading) {
            this.setState({...this.state, loading: true});
            this.props.onPress().then(() => this.setState({...this.state, loading: false}));
        }
    }

    render(): JSX.Element {
        const {text, style, textStyle, loadingIndicatorStyle, color, theme} = this.props;
        const {loading} = this.state;

        return (
            <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={text}
                {...{onPress: loading ? undefined : () => this.onPress()}}
                style={style}
            >
                {loading && (
                    <ActivityIndicator
                        color={color || theme.accentTernary}
                        style={[
                            {position: "absolute", top: 0, right: 0, bottom: 0, left: 0, margin: "auto"},
                            loadingIndicatorStyle,
                        ]}
                    />
                )}
                <Text style={[{opacity: loading ? 0 : 1}, textStyle]}>{text}</Text>
            </TouchableOpacity>
        );
    }
}

export default withTheme(AsyncButton);
