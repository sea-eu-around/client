import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {SupportedLocale} from "../../localization";
import {AppState} from "../../state/types";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    locale: state.settings.userSettings.locale,
}));

export type LocaleAwareProps = React.PropsWithChildren<ConnectedProps<typeof reduxConnector>> & {
    onLocaleChange?: (locale: SupportedLocale) => void;
};

/**
 * This provider receives the current theme from the store and passes it down to all
 * children (direct or indirect) that are exported using withTheme(<component>).
 */
class LocaleAware extends React.Component<LocaleAwareProps> {
    componentDidUpdate(oldProps: LocaleAwareProps) {
        const {locale, onLocaleChange} = this.props;
        if (oldProps.locale !== locale) {
            if (onLocaleChange) onLocaleChange(locale);
        }
    }

    render(): JSX.Element {
        const {children} = this.props;
        return <>{children}</>;
    }
}

export default reduxConnector(LocaleAware);
