import * as React from "react";
import {ActivityIndicator, StyleProp, Text, View, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";
import Button, {ButtonProps, BUTTON_SKINS} from "./Button";

// Component props
export type AsyncButtonProps = Omit<ButtonProps, "onPress"> & {
    onPress: () => Promise<unknown>;
    loadingIndicatorStyle?: StyleProp<ViewStyle>;
    loadingIndicatorColor?: string;
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
        const {loadingIndicatorStyle, loadingIndicatorColor, theme, ...otherProps} = this.props;
        const {loading} = this.state;

        const skinStyles = this.props.skin ? BUTTON_SKINS[this.props.skin](theme) : {button: {}, text: {}};

        return (
            <Button {...otherProps} {...{onPress: loading ? undefined : () => this.onPress()}}>
                {loading && (
                    <>
                        <ActivityIndicator
                            color={loadingIndicatorColor || theme.accentTernary}
                            style={[
                                {position: "absolute", top: 0, right: 0, bottom: 0, left: 0, margin: "auto"},
                                loadingIndicatorStyle,
                            ]}
                        />
                        <View style={{opacity: 0}}>
                            <Text style={[skinStyles.text, this.props.textStyle]}>{this.props.text}</Text>
                            {this.props.icon}
                        </View>
                    </>
                )}
            </Button>
        );
    }
}

export default withTheme(AsyncButton);
