import * as React from "react";
import {StyleSheet} from "react-native";
import CountryPicker, {
    Country,
    CountryCode,
    DARK_THEME,
    DEFAULT_THEME,
    TranslationLanguageCode,
} from "react-native-country-picker-modal";
import i18n from "i18n-js";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";

// Component props
export type NationalityPickerProps = ThemeProps & {
    nationality?: CountryCode;
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
        const {theme} = this.props;
        const {open} = this.state;
        const styles = themedStyles(theme);

        return (
            <CountryPicker
                countryCode={this.props.nationality || "FR"}
                filterProps={{placeholder: i18n.t("search")}}
                withFlag={true}
                withFilter={true}
                withEmoji={false}
                onSelect={(country: Country) => {
                    if (this.props.onSelect) this.props.onSelect(country.cca2);
                }}
                onClose={() => this.hideModal()}
                translation={i18n.t("countryPickerLanguageCode") as TranslationLanguageCode}
                visible={open}
                containerButtonStyle={styles.pickerContainerButton}
                theme={theme.id === "dark" ? DARK_THEME : DEFAULT_THEME}
            ></CountryPicker>
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        pickerContainerButton: {
            display: "none",
        },
    });
});

export default withTheme(NationalityPicker);
