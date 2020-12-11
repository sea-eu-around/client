import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import themes from "../../constants/themes";
import {ThemeProvider} from "react-native-elements";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    currentTheme: state.settings.userSettings.theme,
}));

export type ConnectedThemeProviderProps = React.PropsWithChildren<ConnectedProps<typeof reduxConnector>>;

/**
 * This provider receives the current theme from the store and passes it down to all
 * children (direct or indirect) that are exported using withTheme(<component>).
 */
class ConnectedThemeProvider extends React.Component<ConnectedThemeProviderProps> {
    render(): JSX.Element {
        const {children, currentTheme} = this.props;
        return (
            <ThemeProvider key={currentTheme} theme={themes[currentTheme]}>
                {children}
            </ThemeProvider>
        );
    }
}

export default reduxConnector(ConnectedThemeProvider);
