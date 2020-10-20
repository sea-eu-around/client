import * as React from "react";

import {Text, TextProps, TextStyle} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import themes from "../constants/themes";
import {AppState} from "../state/types";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
}));

// Component props
export type InputLabelProps = ConnectedProps<typeof reduxConnector> & TextProps;

class InputLabel extends React.Component<InputLabelProps> {
    render(): JSX.Element {
        const {theme, style, ...otherProps} = this.props;

        const defaultStyle: TextStyle = {
            color: theme.textLight,
            textTransform: "uppercase",
            letterSpacing: 1,
            fontSize: 12,
        };

        return (
            <Text {...otherProps} style={[defaultStyle, style]}>
                {this.props.children}
            </Text>
        );
    }
}

export default reduxConnector(InputLabel);
