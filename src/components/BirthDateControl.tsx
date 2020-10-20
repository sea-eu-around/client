import * as React from "react";
import {View} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import themes from "../constants/themes";
import {AppState} from "../state/types";
import {connect, ConnectedProps} from "react-redux";
import BirthDatePicker from "./BirthDatePicker";
import {FormattedDate} from "./FormattedDate";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
}));

// Component props
export type BirthDateControlProps = ConnectedProps<typeof reduxConnector> & {
    date?: Date;
    onSelect?: (date: Date) => void;
    onHide?: () => void;
};

export type BirthDateControlState = {
    open: boolean;
};

class BirthDateControl extends React.Component<BirthDateControlProps, BirthDateControlState> {
    constructor(props: BirthDateControlProps) {
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
        const {date, onSelect, theme} = this.props;
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
            dateText: {
                fontSize: 20,
            },
        };

        return (
            <View style={{width: "100%"}}>
                <TouchableOpacity style={[styles.button, date ? styles.buttonOk : {}]} onPress={() => this.showModal()}>
                    {date && <FormattedDate style={styles.dateText} date={date} />}
                    {/*!date && <Text>Click to change value</Text>*/}
                </TouchableOpacity>
                <BirthDatePicker
                    date={date}
                    open={open}
                    onSelect={(value: Date) => {
                        if (onSelect) onSelect(value);
                    }}
                    onHide={() => this.hideModal()}
                ></BirthDatePicker>
            </View>
        );
    }
}

export default reduxConnector(BirthDateControl);
