import React from "react";
import CustomModal, {CustomModalClass, CustomModalProps} from "./CustomModal";
import CreateGroupForm from "../forms/CreateGroupForm";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";

export type CreateGroupModalProps = ThemeProps & Partial<CustomModalProps>;

export class CreateGroupModalClass extends React.Component<CreateGroupModalProps> {
    modalRef = React.createRef<CustomModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {...otherProps} = this.props;

        return (
            <CustomModal
                ref={this.modalRef}
                animationType="slide"
                nonDismissable
                fullWidth
                fullHeight
                modalViewStyle={{paddingVertical: 60, paddingHorizontal: 30}}
                renderContent={(hide) => <CreateGroupForm onCancel={hide} onSuccessfulSubmit={hide} />}
                {...otherProps}
            />
        );
    }
}

export default withTheme(CreateGroupModalClass);
