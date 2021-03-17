import {StatusBar} from "expo-status-bar";
import * as React from "react";
import {withTheme} from "react-native-elements";
import {STATUS_BAR_THEME_OVERRIDES} from "../constants/route-settings";
import {NavigatorRoute} from "../navigation/types";
import {rootNavigationRef} from "../navigation/utils";
import {ThemeKey, ThemeProps} from "../types";

export const statusBarRef = React.createRef<ThemedStatusBarClass>();

// Component props
export type ThemedStatusBarProps = ThemeProps;

type ThemedStatusBarState = {style: ThemeKey};

class ThemedStatusBarClass extends React.Component<ThemedStatusBarProps, ThemedStatusBarState> {
    constructor(props: ThemedStatusBarProps) {
        super(props);
        this.state = {style: this.getDefaultStyle()};
    }

    private getThemeOverride(): ThemeKey | undefined {
        const routeName = rootNavigationRef.current?.getCurrentRoute()?.name as NavigatorRoute;
        return STATUS_BAR_THEME_OVERRIDES[routeName];
    }

    private getDefaultStyle(): ThemeKey {
        return this.props.theme.id == "dark" ? "light" : "dark";
    }

    setStyle(style?: ThemeKey): void {
        const newStyle = style || this.getDefaultStyle();
        if (newStyle !== this.state.style) {
            this.setState({style: newStyle});
            this.forceUpdate();
        }
    }

    getStyle(): ThemeKey {
        return this.state.style;
    }

    componentDidMount(): void {
        const nav = rootNavigationRef.current;

        if (nav) {
            // Ensure we update the status bar theme when needed
            nav.addListener("state", () => {
                const override = this.getThemeOverride();
                this.setStyle(override);
            });
        }
    }

    render(): JSX.Element {
        const {style} = this.state;
        return <StatusBar style={style} />;
    }
}

export default withTheme((props: ThemedStatusBarProps) => <ThemedStatusBarClass ref={statusBarRef} {...props} />);
