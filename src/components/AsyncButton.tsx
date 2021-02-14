import * as React from "react";
import {ActivityIndicator, StyleProp, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";
import Button, {ButtonProps} from "./Button";

// Component props
export type AsyncButtonProps = Omit<ButtonProps, "onPress"> & {
    onPress: () => Promise<unknown>;
    loadingIndicatorStyle?: StyleProp<ViewStyle>;
    loadingIndicatorColor?: string;
    loadingIndicatorSize?: number;
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
        const {loadingIndicatorStyle, loadingIndicatorColor, loadingIndicatorSize, theme, ...otherProps} = this.props;
        const {loading} = this.state;

        return (
            <Button
                {...otherProps}
                {...{onPress: loading ? undefined : () => this.onPress()}}
                contentOpacity={loading ? 0 : 1}
            >
                {loading && (
                    <ActivityIndicator
                        color={loadingIndicatorColor || theme.accentTernary}
                        size={loadingIndicatorSize || 24}
                        style={[
                            {position: "absolute", top: 0, right: 0, bottom: 0, left: 0, margin: "auto"},
                            loadingIndicatorStyle,
                        ]}
                    />
                )}
            </Button>
        );
    }
}

export default withTheme(AsyncButton);
