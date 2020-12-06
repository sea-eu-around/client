import * as React from "react";

type ErrorBoundaryProps = React.PropsWithChildren<Record<string, unknown>>;

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    componentDidCatch(e: Error, info: React.ErrorInfo): void {
        console.log(`Error caught by ErrorBoundary: ${e.name} - ${e.message}`);
        console.log("Stack :", info.componentStack);
    }

    render(): JSX.Element {
        return <>{this.props.children}</>;
    }
}
