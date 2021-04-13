import * as React from "react";
import {ActivityIndicator, StyleProp, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {makePromiseCancelable} from "../general-utils";
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
    private cancelPressPromise: (() => void) | null = null;

    constructor(props: AsyncButtonProps) {
        super(props);
        this.state = {loading: false};
    }

    componentDidMount(): void {
        // Reset the state to loading: false
        this.setState({loading: false});
    }

    componentWillUnmount(): void {
        if (this.cancelPressPromise) {
            this.cancelPressPromise();
            this.cancelPressPromise = null;
        }
    }

    onPress(): void {
        if (!this.state.loading) {
            this.setState({...this.state, loading: true});
            // Use a cancelable promise to avoid triggering a state update on an unmounted component
            const promise = makePromiseCancelable(this.props.onPress());
            promise.then(() => {
                this.setState({...this.state, loading: false});
                this.cancelPressPromise = null;
            });
            this.cancelPressPromise = promise.cancel;
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
                disabled={loading}
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
