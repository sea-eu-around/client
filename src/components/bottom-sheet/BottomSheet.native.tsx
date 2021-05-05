import * as React from "react";
import {withTheme} from "react-native-elements";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import BottomSheetBackdrop from "./BottomSheetBackdrop";
import {BottomSheetProps} from "./types";

export class BottomSheetClass extends React.Component<BottomSheetProps> {
    sheetRef = React.createRef<BottomSheetModal>();

    show(): void {
        this.sheetRef.current?.present();
    }

    hide(): void {
        this.sheetRef.current?.dismiss();
    }

    render(): JSX.Element {
        const {activator, renderContent} = this.props;

        const hide = () => this.hide();
        const snapPoints = this.props.snapPoints || [0, 280];

        return (
            <>
                {activator && activator(() => this.show())}
                <BottomSheetModal
                    ref={this.sheetRef}
                    snapPoints={snapPoints}
                    backdropComponent={(props) => (
                        <BottomSheetBackdrop
                            {...props}
                            firstSnapPoint={snapPoints.length > 1 ? snapPoints[1] : snapPoints[0]}
                        />
                    )}
                    animationDuration={300}
                    index={1}
                >
                    {renderContent(hide)}
                </BottomSheetModal>
            </>
        );
    }
}

export default withTheme(BottomSheetClass);
