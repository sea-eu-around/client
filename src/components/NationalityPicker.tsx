import * as React from "react";

import CountryPicker, {Country, CountryCode, TranslationLanguageCode} from "react-native-country-picker-modal";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import themes from "../constants/themes";

// Map props from store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.theming.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
export type NationalityControlProps = ConnectedProps<typeof reduxConnector> & {
    nationality: CountryCode;
    onSelect?: (countryCode: CountryCode) => void;
    onClose?: () => void;
};

class NationalityControl extends React.Component<NationalityControlProps> {
    render(): JSX.Element {
        const {onClose} = this.props;

        return (
            <CountryPicker
                countryCode={this.props.nationality}
                filterProps={{placeholder: i18n.t("search")}}
                containerButtonStyle={{display: "none"}}
                withFlag={true}
                withFilter={true}
                withEmoji={false}
                onSelect={(country: Country) => {
                    if (this.props.onSelect) this.props.onSelect(country.cca2);
                }}
                onClose={onClose}
                translation={i18n.t("countryPickerLanguageCode") as TranslationLanguageCode}
                visible={true}
            ></CountryPicker>
        );
    }
}

export default reduxConnector(NationalityControl);
