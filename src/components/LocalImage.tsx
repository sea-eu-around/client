import * as React from "react";
import {ImageProps, Image} from "react-native";
import {getLocalImage} from "../assets";

// Component props
export type LocalImageProps = Partial<ImageProps> & {imageKey: string};

class LocalImage extends React.Component<LocalImageProps> {
    render(): JSX.Element {
        const {imageKey, ...otherProps} = this.props;
        return <Image source={getLocalImage(imageKey, () => this.forceUpdate())} {...otherProps} />;
    }
}

export default LocalImage;
