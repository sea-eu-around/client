import * as React from "react";
import {ActivityIndicator, StyleProp, Text, TextStyle, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";
import Button from "../Button";

// Component props
type FormSubmitButtonProps = {
    onPress: () => void;
    text: string;
    icon?: JSX.Element;
    submitting: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    loadingIndicatorStyle?: StyleProp<ViewStyle>;
} & ThemeProps;

class FormSubmitButton extends React.Component<FormSubmitButtonProps> {
    render(): JSX.Element {
        const {submitting, onPress, text, icon, style, textStyle, loadingIndicatorStyle, theme} = this.props;

        return (
            <Button
                {...{onPress: submitting ? undefined : onPress}}
                style={[{flexDirection: "row", alignItems: "center"}, style]}
            >
                {submitting && <ActivityIndicator color={theme.accentTernary} style={loadingIndicatorStyle} />}
                {!submitting && (
                    <>
                        <Text style={textStyle}>{text}</Text>
                        {icon}
                    </>
                )}
            </Button>
        );
    }
}

export default withTheme(FormSubmitButton);
