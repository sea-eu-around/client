import * as React from "react";
import {withTheme} from "react-native-elements";
import CustomModal, {CustomModalClass} from "../modals/CustomModal";
import {BottomSheetProps} from "./types";

export class BottomSheetClass extends React.Component<BottomSheetProps> {
    webModalRef = React.createRef<CustomModalClass>();
    skipNextUpdate = false;

    show(): void {
        this.webModalRef.current?.show();
    }

    hide(): void {
        this.webModalRef.current?.hide();
    }

    render(): JSX.Element {
        const {activator, renderContent} = this.props;
        const hide = () => this.hide();

        return (
            <CustomModal
                ref={this.webModalRef}
                modalViewStyle={{paddingHorizontal: 0, paddingVertical: 0}}
                renderContent={() => renderContent(hide)}
                activator={activator}
            />
        );
    }
}

export default withTheme(BottomSheetClass);
