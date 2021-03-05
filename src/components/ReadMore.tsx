import * as React from "react";
import ReadMoreComp, {ReadMoreProps as ReadMoreCompProps} from "react-native-read-more-text";

export type ReadMoreProps = ReadMoreCompProps;

export class ReadMore extends React.Component<ReadMoreProps> {
    render(): JSX.Element {
        const {children, ...props} = this.props;
        return <ReadMoreComp {...props}>{children}</ReadMoreComp>;
    }
}
