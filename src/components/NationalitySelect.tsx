import * as React from "react";

import {Text, View} from "react-native";
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
export type NationalitySelectProps = ConnectedProps<typeof reduxConnector> & {
    nationality: CountryCode;
    onSelect?: (countryCode: CountryCode) => void;
};

const styles = {
    containerButton: {
        marginTop: 4,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
};

class NationalitySelect extends React.Component<NationalitySelectProps> {
    render(): JSX.Element {
        const {theme} = this.props;

        return (
            <View style={{flex: 1, width: "100%"}}>
                <Text>{i18n.t("nationality")}</Text>
                <CountryPicker
                    countryCode={this.props.nationality}
                    filterProps={{placeholder: i18n.t("search")}}
                    containerButtonStyle={[styles.containerButton, {backgroundColor: theme.accentSlight}]}
                    withFlag={true}
                    withFilter={true}
                    withEmoji={false}
                    withCountryNameButton={true}
                    onSelect={(country: Country) => {
                        if (this.props.onSelect) this.props.onSelect(country.cca2);
                    }}
                    translation={i18n.t("countryPickerLanguageCode") as TranslationLanguageCode}
                    placeholder={i18n.t("selectCountry")}
                ></CountryPicker>
            </View>
        );
    }
}

export default reduxConnector(NationalitySelect);
