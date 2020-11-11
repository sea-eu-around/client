import * as React from "react";
import {Text, TextProps} from "react-native";

// Component props
export type TextLinkProps = {
    text: string;
} & TextProps;

function TextLink(props: React.PropsWithChildren<TextLinkProps>): JSX.Element {
    const {text, ...textProps} = props;

    return (
        <Text {...textProps} style={[textProps ? textProps.style : {}, {color: "#2e78b7"}]}>
            {text}
        </Text>
    );
}

export default TextLink;
