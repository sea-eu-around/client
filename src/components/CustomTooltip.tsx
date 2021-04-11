import React from "react";
import {Text, StyleSheet, TouchableOpacity} from "react-native";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {Theme} from "../types";
import CustomModal, {CustomModalClass} from "./modals/CustomModal";
import {CustomTooltipProps} from "./CustomTooltip.native";

class CustomTooltip extends React.Component<CustomTooltipProps> {
    modalRef = React.createRef<CustomModalClass>();

    render(): JSX.Element {
        const {theme, text} = this.props;
        const styles = tooltipStyles(theme);

        return (
            <>
                <TouchableOpacity activeOpacity={0.5} onPress={() => this.modalRef.current?.show()}>
                    {this.props.children}
                </TouchableOpacity>
                <CustomModal
                    ref={this.modalRef}
                    onHide={() => this.setState({...this.state, shown: false})}
                    modalViewStyle={styles.container}
                    renderContent={() => <Text style={styles.text}>{text}</Text>}
                />
            </>
        );
    }
}

export const tooltipStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        text: {
            textAlign: "justify",
            paddingVertical: 10,
            fontSize: 14,
            color: theme.textBlack,
        },
        container: {
            alignContent: "center",
            borderRadius: 4,
            paddingHorizontal: 20,
            width: 250,
            paddingVertical: 0,
            backgroundColor: theme.accentSlight,
        },
    });
});

export default withTheme(CustomTooltip);
