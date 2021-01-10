import {BlurView} from "expo-blur";
import React from "react";
import ReactDOM from "react-dom";
import {StyleProp, TouchableOpacity, View, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {BLUR_MODAL_INTENSITY} from "../../styles/general";
import {ModalImplProps} from "./ModalImpl.native";

type ModalImplState = {
    modalVisible: boolean;
};

export class ModalImplClass extends React.Component<ModalImplProps, ModalImplState> {
    el: HTMLDivElement;

    constructor(props: ModalImplProps) {
        super(props);
        this.state = {modalVisible: props.visible || false};
        this.el = document.createElement("div");
    }

    componentDidMount(): void {
        document.body.appendChild(this.el);
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
            bottom,
            fullWidth,
            fullHeight,
            nonDismissable,
            noBackground,
            backdropOpacity,
            backdropBlur,
        } = this.props;
        const {modalVisible} = this.state;

        const fixedFullSize = {
            position: "fixed",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
        };

        const modal = modalVisible ? (
            <>
                {backdropBlur && (
                    <BlurView style={{flex: 1, ...fixedFullSize}} tint={"dark"} intensity={BLUR_MODAL_INTENSITY} />
                )}
                <TouchableOpacity
                    style={
                        ({
                            ...fixedFullSize,
                            backgroundColor: `rgba(0,0,0,${backdropOpacity || 0.05})`,
                            cursor: "pointer",
                        } as unknown) as StyleProp<ViewStyle> // force typings to accept web-specific styling
                    }
                    activeOpacity={1.0}
                    onPress={nonDismissable ? undefined : () => this.setModalVisible(false)}
                />
                <View
                    style={[
                        ({
                            // Centering
                            position: "fixed",
                            left: 0,
                            right: 0,
                            ...(bottom ? {} : {top: 0}),
                            bottom: 0,
                            margin: "auto",
                            // Actual styling
                            width: "50%",
                            height: "fit-content",
                            maxWidth: 300,
                            borderRadius: 3,
                            paddingVertical: 20,
                            paddingHorizontal: 30,
                            alignItems: "center",
                        } as unknown) as ViewStyle, // force typings to accept web-specific styling
                        fullWidth ? {width: "100%", maxWidth: "100%"} : {},
                        fullHeight ? {height: "100%"} : {},
                        !noBackground
                            ? (({
                                  backgroundColor: theme.cardBackground,
                                  boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.05)",
                              } as unknown) as ViewStyle)
                            : {},
                        modalViewStyle,
                    ]}
                >
                    {this.props.renderContent(() => this.setModalVisible(false))}
                </View>
            </>
        ) : (
            <></>
        );

        // "Teleport" the modal to an element that we previously appended to the <body>
        return ReactDOM.createPortal(modal, this.el);
    }
}

export default withTheme(ModalImplClass);
