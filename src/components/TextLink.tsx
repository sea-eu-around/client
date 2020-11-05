import * as React from "react";
import {Text, TextProps} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import themes from "../constants/themes";
import {AppState} from "../state/types";

// State-linked props
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
}));

// Component props
export type TextLinkProps = {
    text: string;
} & ConnectedProps<typeof reduxConnector> &
    TextProps;

function TextLink(props: React.PropsWithChildren<TextLinkProps>): JSX.Element {
    const {theme, ...textProps} = props;

    return (
        <Text {...textProps} style={[textProps ? textProps.style : {}, {color: "#2e78b7"}]}>
            {props.text}
        </Text>
    );
}

export default reduxConnector(TextLink);
