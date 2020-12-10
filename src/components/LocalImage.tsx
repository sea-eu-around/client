import * as React from "react";
import {ImageProps, Image} from "react-native";
import {getLocalImage} from "../assets";

// Component props
export type LocalImageProps = Partial<ImageProps> & {imageKey: string};

class LocalImage extends React.Component<LocalImageProps> {
    render(): JSX.Element {
        const {imageKey, ...otherProps} = this.props;
        const img = getLocalImage(imageKey, () => this.forceUpdate());
        return img ? <Image source={img} {...otherProps} /> : <></>;
    }
}

export default LocalImage;
