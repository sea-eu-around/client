import * as React from "react";
import {ActivityIndicator, StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";

// Component props
type FormSubmitButtonProps = {
    onPress: () => void;
    submitting: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    loadingIndicatorStyle?: StyleProp<ViewStyle>;
    text: string;
    icon?: JSX.Element;
} & ThemeProps;

class FormSubmitButton extends React.Component<FormSubmitButtonProps> {
    render(): JSX.Element {
        const {submitting, onPress, text, icon, style, textStyle, loadingIndicatorStyle, theme} = this.props;

        return (
            <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={text}
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
            </TouchableOpacity>
        );
    }
}

export default withTheme(FormSubmitButton);
