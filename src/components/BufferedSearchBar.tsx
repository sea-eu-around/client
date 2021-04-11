import * as React from "react";
import {Platform, ViewStyle} from "react-native";
import {SearchBar, SearchBarProps} from "react-native-elements";

// Component props
export type BufferedSearchBarProps = {
    bufferDelay: number;
    onBufferedUpdate?: (text: string) => void;
} & SearchBarProps;

class BufferedSearchBar extends React.Component<BufferedSearchBarProps> {
    private updateTimeout: NodeJS.Timeout | null = null;

    private onChange(text: string) {
        const {bufferDelay, onBufferedUpdate} = this.props;

        if (this.updateTimeout) clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => {
            this.updateTimeout = null;
            if (onBufferedUpdate) onBufferedUpdate(text);
        }, bufferDelay);
    }

    render(): JSX.Element {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {bufferDelay, onBufferedUpdate, onChangeText, ...searchBarProps} = this.props;

        return (
            <SearchBar
                onChangeText={(search: string) => {
                    if (onChangeText) onChangeText(search);
                    this.onChange(search);
                }}
                style={[Platform.OS === "web" && ({outline: "none"} as ViewStyle), searchBarProps.style]}
                {...searchBarProps}
            />
        );
    }
}

export default BufferedSearchBar;
