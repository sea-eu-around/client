import * as React from "react";

export default class BottomSheetModalProvider extends React.Component<React.PropsWithChildren<unknown>> {
    render(): JSX.Element {
        return <>{this.props.children}</>;
    }
}
