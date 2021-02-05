import React from "react";
import CustomModal, {CustomModalClass, CustomModalProps} from "./CustomModal";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import CreatePostForm from "../forms/CreatePostForm";
import {Group} from "../../model/groups";

export type CreatePostModalProps = ThemeProps & Partial<CustomModalProps> & {group: Group};

export class CreatePostModalClass extends React.Component<CreatePostModalProps> {
    modalRef = React.createRef<CustomModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {group, ...otherProps} = this.props;

        return (
            <CustomModal
                ref={this.modalRef}
                animationType="slide"
                nonDismissable
                fullWidth
                fullHeight
                modalViewStyle={{paddingVertical: 60, paddingHorizontal: 30}}
                renderContent={(hide) => <CreatePostForm group={group} onCancel={hide} onSuccessfulSubmit={hide} />}
                {...otherProps}
            />
        );
    }
}

export default withTheme(CreatePostModalClass);
