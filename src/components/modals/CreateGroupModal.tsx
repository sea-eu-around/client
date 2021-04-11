import React from "react";
import CustomModal, {CustomModalClass, CustomModalProps} from "./CustomModal";
import CreateGroupForm from "../forms/CreateGroupForm";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {SafeAreaInsetsContext} from "react-native-safe-area-context";

export type CreateGroupModalProps = ThemeProps & Partial<CustomModalProps>;

export class CreateGroupModalClass extends React.Component<CreateGroupModalProps> {
    modalRef = React.createRef<CustomModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {...otherProps} = this.props;

        return (
            <SafeAreaInsetsContext.Consumer>
                {(insets) => (
                    <CustomModal
                        ref={this.modalRef}
                        animationType="slide"
                        nonDismissable
                        fullWidth
                        fullHeight
                        statusBarTranslucent
                        modalViewStyle={{
                            paddingTop: 30 + (insets?.top || 0),
                            paddingBottom: 30 + (insets?.bottom || 0),
                            paddingHorizontal: 30,
                        }}
                        renderContent={(hide) => <CreateGroupForm onCancel={hide} onSuccessfulSubmit={hide} />}
                        {...otherProps}
                    />
                )}
            </SafeAreaInsetsContext.Consumer>
        );
    }
}

export default withTheme(CreateGroupModalClass);
