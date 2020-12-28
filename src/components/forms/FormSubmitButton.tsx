import * as React from "react";
import {ActivityIndicator, StyleProp, TextStyle, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";
import Button, {ButtonSkin} from "../Button";

// Component props
type FormSubmitButtonProps = {
    onPress: () => void;
    text: string;
    icon?: JSX.Element;
    submitting: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    loadingIndicatorStyle?: StyleProp<ViewStyle>;
    skin?: ButtonSkin;
} & ThemeProps;

class FormSubmitButton extends React.Component<FormSubmitButtonProps> {
    render(): JSX.Element {
        const {submitting, onPress, style, loadingIndicatorStyle, theme, ...otherProps} = this.props;

        return (
            <Button
                {...{onPress: submitting ? undefined : onPress}}
                style={[{flexDirection: "row", alignItems: "center"}, style]}
                {...otherProps}
            >
                {submitting && <ActivityIndicator color={theme.accentTernary} style={loadingIndicatorStyle} />}
            </Button>
        );
    }
}

export default withTheme(FormSubmitButton);
