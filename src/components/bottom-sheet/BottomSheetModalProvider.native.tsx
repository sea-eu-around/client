import * as React from "react";
import {BottomSheetModalProvider as Provider} from "@gorhom/bottom-sheet";

export default class BottomSheetModalProvider extends React.Component<React.PropsWithChildren<unknown>> {
    render(): JSX.Element {
        return <Provider>{this.props.children}</Provider>;
    }
}
