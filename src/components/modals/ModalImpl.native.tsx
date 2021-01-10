import {BlurView} from "expo-blur";
import React from "react";
import {Modal, TouchableOpacity, ViewStyle, StyleSheet, StyleProp} from "react-native";
import {withTheme} from "react-native-elements";
import {BLUR_MODAL_INTENSITY} from "../../styles/general";
import {preTheme} from "../../styles/utils";
import {ThemeProps} from "../../types";

export type ModalImplProps = ThemeProps & {
    onHide?: () => void;
    onShow?: () => void;
    renderContent: (hide: () => void) => JSX.Element;
    modalViewStyle?: StyleProp<ViewStyle>;
    visible?: boolean;
    animationType?: "fade" | "none" | "slide" | undefined;
    bottom?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    nonDismissable?: boolean;
    noBackground?: boolean;
    backdropOpacity?: number;
    backdropBlur?: boolean;
};

type ModalImplState = {
    modalVisible: boolean;
};

class ModalImpl extends React.Component<ModalImplProps, ModalImplState> {
    constructor(props: ModalImplProps) {
        super(props);
        this.state = {modalVisible: props.visible || false};
    }

    componentDidUpdate(oldProps: ModalImplProps): void {
        if (oldProps.visible && !this.props.visible) this.setModalVisible(false);
        if (!oldProps.visible && this.props.visible) this.setModalVisible(true);
    }

    setModalVisible(b: boolean): void {
        this.setState({...this.state, modalVisible: b});
        if (!b && this.props.onHide) this.props.onHide();
        if (b && this.props.onShow) this.props.onShow();
    }

    render(): JSX.Element {
        const {
            theme,
            modalViewStyle,
            animationType,
            bottom,
            fullWidth,
            fullHeight,
            nonDismissable,
            noBackground,
            backdropOpacity,
            backdropBlur,
        } = this.props;
        const {modalVisible} = this.state;

        const styles = themedStyles(theme);
        const backdropColor = `rgba(0,0,0,${backdropOpacity === undefined ? 0.05 : backdropOpacity})`;

        const content = (
            <TouchableOpacity
                style={[styles.backdrop, {backgroundColor: backdropColor}]}
                activeOpacity={1.0}
                onPress={nonDismissable ? undefined : () => this.setModalVisible(false)}
            >
                <TouchableOpacity
                    // This TouchableOpacity intercepts press events so the modal doesn't hide when pressed
                    activeOpacity={1.0}
                    style={[
                        styles.modalView,
                        bottom ? {position: "absolute", bottom: 0, margin: 0} : {},
                        fullWidth ? {width: "100%", maxWidth: "100%"} : {},
                        fullHeight ? {height: "100%"} : {},
                        !noBackground
                            ? {
                                  backgroundColor: theme.cardBackground,
                                  shadowColor: "#000",
                                  shadowOffset: {width: 0, height: 1},
                                  shadowOpacity: 0.22,
                                  shadowRadius: 2.22,
                                  elevation: 3,
                              }
                            : {elevation: 0, shadowRadius: 0},
                        modalViewStyle,
                    ]}
                >
                    {this.props.renderContent(() => this.setModalVisible(false))}
                </TouchableOpacity>
            </TouchableOpacity>
        );

        return (
            <Modal animationType={animationType} transparent={true} statusBarTranslucent={true} visible={modalVisible}>
                {backdropBlur ? (
                    <BlurView style={{flex: 1}} tint={"dark"} intensity={BLUR_MODAL_INTENSITY}>
                        {content}
                    </BlurView>
                ) : (
                    content
                )}
            </Modal>
        );
    }
}

export const themedStyles = preTheme(() => {
    return StyleSheet.create({
        backdrop: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
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
        },
    });
});

export default withTheme(ModalImpl);
