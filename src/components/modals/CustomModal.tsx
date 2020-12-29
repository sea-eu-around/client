import React from "react";
import {withTheme} from "react-native-elements";
import CustomModal, {ModalImplClass} from "./ModalImpl";
import {ModalImplProps} from "./ModalImpl.native";

export type ModalActivator = (show: () => void) => JSX.Element;

export type CustomModalProps = ModalImplProps & {activator?: ModalActivator};

export class CustomModalClass extends React.Component<CustomModalProps> {
    modalRef = React.createRef<ModalImplClass>();

    show(): void {
        this.modalRef.current?.setModalVisible(true);
    }

    hide(): void {
        this.modalRef.current?.setModalVisible(false);
    }

    render(): JSX.Element {
        const {activator, ...otherProps} = this.props;

        const activatorElement = activator ? activator(() => this.show()) : <></>;

        return (
            <>
                {activatorElement}
                <CustomModal ref={this.modalRef} {...otherProps} />
            </>
        );
    }
}

export default withTheme(CustomModalClass);
