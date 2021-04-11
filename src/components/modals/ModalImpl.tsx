import {BlurView} from "expo-blur";
import React from "react";
import ReactDOM from "react-dom";
import {StyleProp, TouchableOpacity, View, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {BLUR_MODAL_INTENSITY} from "../../styles/general";
import {DEFAULT_MODAL_BACKDROP_OPACITY, ModalImplProps} from "./ModalImpl.native";

type ModalImplState = {
    modalVisible: boolean;
};

let container: HTMLDivElement | null = null;

export class ModalImplClass extends React.Component<ModalImplProps, ModalImplState> {
    constructor(props: ModalImplProps) {
        super(props);
        this.state = {modalVisible: props.visible || false};
    }

    componentDidMount(): void {
        if (container === null) {
            container = document.createElement("div");
            container.style.zIndex = "1000";
            document.body.appendChild(container);
        }
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
                            backgroundColor: `rgba(0,0,0,${
                                backdropOpacity === undefined ? DEFAULT_MODAL_BACKDROP_OPACITY : backdropOpacity
                            })`,
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
                            margin: "auto",
                            // Actual styling
                            width: "80%",
                            maxWidth: 300,
                            borderRadius: 3,
                            paddingVertical: 20,
                            paddingHorizontal: 30,
                            alignItems: "center",
                        } as unknown) as ViewStyle, // force typings to accept web-specific styling
                        fullWidth ? {width: "100%", maxWidth: "100%"} : {},
                        fullHeight
                            ? {height: "100%"}
                            : bottom
                            ? {bottom: 0}
                            : (({top: "50%", transform: "translateY(-50%)"} as unknown) as ViewStyle),
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
        return container ? ReactDOM.createPortal(modal, container) : <></>;
    }
}

export default withTheme(ModalImplClass);
