import * as React from "react";

import {Text, TextProps, View} from "react-native";
import {CountryCode, Flag, TranslationLanguageCode} from "react-native-country-picker-modal";
import {CountryInfo, getCountryInfoAsync} from "react-native-country-picker-modal/lib/CountryService";
import i18n from "i18n-js";

export type FormattedNationalityProps = {
    countryCode: CountryCode;
    flagSize?: number;
} & TextProps;

export type FormattedNationalityState = {
    countryName: string;
};

export class FormattedNationality extends React.Component<FormattedNationalityProps, FormattedNationalityState> {
    constructor(props: FormattedNationalityProps) {
        super(props);
        this.state = {
            countryName: "",
        };
        this.updateCountryName();
    }

    updateCountryName(): void {
        const {countryCode} = this.props;
        const translation = i18n.t("countryPickerLanguageCode") as TranslationLanguageCode;
        getCountryInfoAsync({countryCode, translation}).then((info: CountryInfo) => {
            this.setState({countryName: info.countryName});
        });
    }

    componentDidUpdate(prevProps: FormattedNationalityProps): void {
        if (this.props.countryCode != prevProps.countryCode) {
            this.updateCountryName();
        }
    }

    render(): JSX.Element {
        const {countryCode, ...otherProps} = this.props;
        const {countryName} = this.state;

        const flagSize = this.props.flagSize || 20;

        return (
            <View style={{flexDirection: "row"}}>
                <Flag countryCode={countryCode} flagSize={flagSize} withEmoji={false}></Flag>
                <Text {...otherProps}>{countryName}</Text>
            </View>
        );
    }
}
