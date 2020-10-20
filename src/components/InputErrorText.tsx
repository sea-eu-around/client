import * as React from "react";

import {Text, TextProps, TextStyle} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import themes from "../constants/themes";
import {AppState} from "../state/types";
import i18n from "i18n-js";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
}));

// Component props
export type InputErrorTextProps = ConnectedProps<typeof reduxConnector> & TextProps & {error: string | null};

class InputErrorText extends React.Component<InputErrorTextProps> {
    render(): JSX.Element {
        const {theme, style, error, ...otherProps} = this.props;

        const defaultStyle: TextStyle = {
            fontSize: 12,
            marginTop: 2,
            marginBottom: -12, // prevents an offset from appearing when there is an error
            color: theme.error,
        };

        return (
            <Text {...otherProps} style={[defaultStyle, style]}>
                {error ? i18n.t(error) : ""}
            </Text>
        );
    }
}

export default reduxConnector(InputErrorText);
