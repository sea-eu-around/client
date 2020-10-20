import * as React from "react";

import {TouchableOpacity, View} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import NationalityPicker from "./NationalityPicker";
import {FormattedNationality} from "./FormattedNationality";
import {CountryCode} from "../model/country-codes";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
}));

// Component props
export type NationalityControlProps = ConnectedProps<typeof reduxConnector> & {
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

        const styles = {
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
            },
        };

        return (
            <View style={{width: "100%"}}>
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

export default reduxConnector(NationalityControl);
