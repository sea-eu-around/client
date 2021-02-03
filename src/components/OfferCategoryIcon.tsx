import * as React from "react";
import {OfferCategory} from "../api/dto";
import {getLocalSvg} from "../assets";
import {SvgProps} from "react-native-svg";

// Component props
export type OfferCategoryIconProps = {
    category: OfferCategory;
    size?: number;
} & Partial<SvgProps>;

class OfferCategoryIcon extends React.Component<OfferCategoryIconProps> {
    render(): JSX.Element {
        const {category, size, ...svgProps} = this.props;

        const SvgIcon = getLocalSvg(`offers.categories.${category}`, () => this.forceUpdate());
        const iconSize = size || 75;

        return <SvgIcon width={iconSize} height={iconSize} {...svgProps} />;
    }
}

export default OfferCategoryIcon;
