import * as React from "react";

import {Text, View, ViewProps} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import themes from "../../constants/themes";
import {AppState} from "../../state/types";

// Map props from store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
export type FormErrorProps = ConnectedProps<typeof reduxConnector> & {
    error: string;
} & ViewProps;

const styles = {
    wrapper: {
        marginVertical: 10,
    },
    text: {
        fontSize: 14,
    },
};

class FormError extends React.Component<FormErrorProps> {
    render(): JSX.Element {
        const {error, theme, style, ...otherProps} = this.props;
        return (
            <View style={[styles.wrapper, style]} {...otherProps}>
                <Text style={[styles.text, {color: theme.error}]}>{error}</Text>
            </View>
        );
    }
}

export default reduxConnector(FormError);
