import React from "react";
import ReactDOM from "react-dom";
import {ViewStyle} from "react-native";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";

export type CustomModalProps = ThemeProps & {
    onHide?: () => void;
    onShow?: () => void;
    renderContent: (hide: () => void) => JSX.Element;
    modalViewStyle?: ViewStyle;
    visible?: boolean;
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
                        <div
                            onClick={() => this.setModalVisible(false)}
                            style={{
                                position: "fixed",
                                width: "100%",
                                height: "100%",
                                left: 0,
                                top: 0,
                                backgroundColor: "rgba(0,0,0,0.05)",
                                cursor: "pointer",
                            }}
                        ></div>
                        <div
                            style={{
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
                                padding: "20px 30px",
                                alignItems: "center",
                                boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.05)",
                                backgroundColor: theme.background,
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                ...(modalViewStyle as any), // (circumvent typing)
                            }}
                        >
                            {this.props.renderContent(() => this.setModalVisible(false))}
                        </div>
                    </>
                )}
            </>
        );

        // "Teleport" the modal to an element that we previously appended to the <body>
        return ReactDOM.createPortal(modal, this.el);
    }
}

export default withTheme(CustomModalClass);
