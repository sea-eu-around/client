import * as React from "react";

import {Text, View} from "react-native";
import CountryPicker, {Country, CountryCode, TranslationLanguageCode} from "react-native-country-picker-modal";
import i18n from "i18n-js";

export type NationalitySelectProps = {
    nationality: CountryCode;
    onSelect?: (countryCode: CountryCode) => void;
};

export class NationalitySelect extends React.Component<NationalitySelectProps> {
    render(): JSX.Element {
        return (
            <View style={{flex: 1, width: "100%"}}>
                <Text>{i18n.t("nationality")}</Text>
                <CountryPicker
                    countryCode={this.props.nationality}
                    filterProps={{placeholder: i18n.t("search")}}
                    containerButtonStyle={{}}
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
