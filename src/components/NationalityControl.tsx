import * as React from "react";
import {TouchableOpacity, View, StyleSheet} from "react-native";
import NationalityPicker from "./NationalityPicker";
import FormattedNationality from "./FormattedNationality";
import {CountryCode} from "../model/country-codes";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";

// Component props
export type NationalityControlProps = ThemeProps & {
    nationality?: CountryCode;
    onSelect?: (countryCode: CountryCode) => void;
    onHide?: () => void;
};

// Component state
export type NationalityControlState = {
    open: boolean;
};

class NationalityControl extends React.Component<NationalityControlProps, NationalityControlState> {
    constructor(props: NationalityControlProps) {
        super(props);
        this.state = {
            open: false,
        };
    }

    showModal(): void {
        if (!this.state.open) this.setState({...this.state, open: true});
    }

    hideModal(): void {
        if (this.state.open) {
            this.setState({...this.state, open: false});
            if (this.props.onHide) this.props.onHide();
        }
    }

    render(): JSX.Element {
        const {onSelect, onHide, nationality, theme} = this.props;
        const {open} = this.state;
        const styles = themedStyles(theme);

        return (
            <View style={styles.wrapper}>
                <TouchableOpacity
                    style={[styles.button, nationality ? styles.buttonOk : {}]}
                    onPress={() => this.showModal()}
                >
                    {nationality && <FormattedNationality countryCode={nationality} style={styles.nationality} />}
                    {/*!date && <Text>Click to change value</Text>*/}
                </TouchableOpacity>
                <NationalityPicker
                    nationality={this.props.nationality}
                    open={open}
                    onSelect={(country: CountryCode) => {
                        if (onSelect) onSelect(country);
                    }}
                    onHide={() => {
                        this.hideModal();
                        if (onHide) onHide();
                    }}
                ></NationalityPicker>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            width: "100%",
        },
        button: {
            width: "100%",
            height: 60,
            borderRadius: 0,
            borderWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.accentTernary,
            backgroundColor: "transparent",
            justifyContent: "center",
        },
        buttonOk: {
            borderBottomWidth: 2,
            borderBottomColor: theme.okay,
        },
        nationality: {
            fontSize: 20,
            color: theme.text,
        },
    });
});

export default withTheme(NationalityControl);
