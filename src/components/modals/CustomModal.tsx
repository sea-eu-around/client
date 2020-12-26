import React from "react";
import ReactDOM from "react-dom";
import {StyleProp, TouchableOpacity, View, ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";

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

export class CustomModalClass extends React.Component<CustomModalProps, CustomModalState> {
    el: HTMLDivElement;

    constructor(props: CustomModalProps) {
        super(props);
        this.state = {modalVisible: props.visible || false};
        this.el = document.createElement("div");
    }

    componentDidMount(): void {
        document.body.appendChild(this.el);
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
        const {theme, modalViewStyle} = this.props;
        const {modalVisible} = this.state;

        const modal = (
            <>
                {modalVisible && (
                    <>
                        <TouchableOpacity
                            onPress={() => this.setModalVisible(false)}
                            style={
                                ({
                                    position: "fixed",
                                    width: "100%",
                                    height: "100%",
                                    left: 0,
                                    top: 0,
                                    backgroundColor: "rgba(0,0,0,0.05)",
                                    cursor: "pointer",
                                } as unknown) as StyleProp<ViewStyle> // force typings to accept web-specific styling
                            }
                        />
                        <View
                            style={[
                                ({
                                    // Centering
                                    position: "fixed",
                                    left: 0,
                                    right: 0,
                                    top: 0,
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
                                    boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.05)",
                                    backgroundColor: theme.background,
                                } as unknown) as ViewStyle, // force typings to accept web-specific styling
                                modalViewStyle,
                            ]}
                        >
                            {this.props.renderContent(() => this.setModalVisible(false))}
                        </View>
                    </>
                )}
            </>
        );

        // "Teleport" the modal to an element that we previously appended to the <body>
        return ReactDOM.createPortal(modal, this.el);
    }
}

export default withTheme(CustomModalClass);
