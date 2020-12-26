import React from "react";
import {Modal, TouchableOpacity, ViewStyle, StyleSheet} from "react-native";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";

export type CustomModalProps = ThemeProps & {
    onHide?: () => void;
    onShow?: () => void;
    renderContent: (hide: () => void) => JSX.Element;
    modalViewStyle?: ViewStyle;
    visible?: boolean;
    animationType?: "fade" | "none" | "slide" | undefined;
};

type CustomModalState = {
    modalVisible: boolean;
};

class CustomModal extends React.Component<CustomModalProps, CustomModalState> {
    constructor(props: CustomModalProps) {
        super(props);
        this.state = {modalVisible: props.visible || false};
    }

    componentDidUpdate(oldProps: CustomModalProps): void {
        if (oldProps.visible && !this.props.visible) this.setModalVisible(false);
        if (!oldProps.visible && this.props.visible) this.setModalVisible(true);
    }

    setModalVisible(b: boolean): void {
        this.setState({...this.state, modalVisible: b});
        if (!b && this.props.onHide) this.props.onHide();
        if (b && this.props.onShow) this.props.onShow();
    }

    render(): JSX.Element {
        const {theme, modalViewStyle, animationType} = this.props;
        const {modalVisible} = this.state;
        const styles = themedStyles(theme);
        return (
            <Modal animationType={animationType} transparent={true} visible={modalVisible}>
                <TouchableOpacity
                    style={styles.centeredView}
                    activeOpacity={1.0}
                    onPress={() => this.setModalVisible(false)}
                >
                    <TouchableOpacity
                        // This TouchableOpacity intercepts press events so the modal doesn't hide when pressed
                        activeOpacity={1.0}
                        style={[styles.modalView, modalViewStyle]}
                    >
                        {this.props.renderContent(() => this.setModalVisible(false))}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.05)",
            borderColor: "transparent",
        },
        modalView: {
            width: "80%",
            maxWidth: 300,
            margin: 20,
            borderRadius: 3,
            paddingVertical: 20,
            paddingHorizontal: 30,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            backgroundColor: theme.background,
        },
    });
});

export default withTheme(CustomModal);
