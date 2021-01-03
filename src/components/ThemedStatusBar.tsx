import {StatusBar} from "expo-status-bar";
import * as React from "react";
import {withTheme} from "react-native-elements";
import {STATUS_BAR_THEME_OVERRIDES} from "../constants/status-bar-theming";
import {NavigatorRoute} from "../navigation/types";
import {rootNavigationRef} from "../navigation/utils";
import {ThemeKey, ThemeProps} from "../types";

// Component props
export type ThemedStatusBarProps = ThemeProps;

class ThemedStatusBar extends React.Component<ThemedStatusBarProps> {
    previousThemeOverride: ThemeKey | undefined;

    getThemeOverride(): ThemeKey | undefined {
        const routeName = rootNavigationRef.current?.getCurrentRoute()?.name as NavigatorRoute;
        return STATUS_BAR_THEME_OVERRIDES[routeName];
    }

    componentDidMount() {
        const nav = rootNavigationRef.current;

        if (nav) {
            // Ensure we update the status bar theme when needed
            nav.addListener("state", () => {
                const override = this.getThemeOverride();
                if (override !== this.previousThemeOverride) this.forceUpdate();
                this.previousThemeOverride = override;
            });
        }
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const defaultStyle: ThemeKey = theme.id == "dark" ? "light" : "dark";

        return <StatusBar style={this.getThemeOverride() || defaultStyle} />;
    }
}

export default withTheme(ThemedStatusBar);
