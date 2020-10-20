import * as React from "react";

import CountryPicker, {Country, CountryCode, TranslationLanguageCode} from "react-native-country-picker-modal";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import themes from "../constants/themes";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
}));

// Component props
export type NationalityPickerProps = ConnectedProps<typeof reduxConnector> & {
    nationality: CountryCode;
    open?: boolean;
    onSelect?: (countryCode: CountryCode) => void;
    onHide?: () => void;
};

// Component state
export type NationalityPickerState = {
    open: boolean;
};

class NationalityPicker extends React.Component<NationalityPickerProps, NationalityPickerState> {
    constructor(props: NationalityPickerProps) {
        super(props);
        this.state = {
            open: props.open === undefined ? true : props.open,
        };
    }

    componentDidUpdate(oldProps: NationalityPickerProps) {
        if (!oldProps.open && this.props.open) this.showModal();
        if (oldProps.open && !this.props.open) this.hideModal();
    }

    showModal(): void {
        if (!this.state.open) this.setState({...this.state, open: true});
    }

    hideModal(): void {
        if (this.state.open) {
            this.setState({...this.state, open: false});
            if (this.props.onHide !== undefined) this.props.onHide();
        }
    }

    render(): JSX.Element {
        const {open} = this.state;

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
                onClose={() => this.hideModal()}
                translation={i18n.t("countryPickerLanguageCode") as TranslationLanguageCode}
                visible={open}
            ></CountryPicker>
        );
    }
}

export default reduxConnector(NationalityPicker);
