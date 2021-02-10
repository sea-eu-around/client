import * as React from "react";
import i18n from "i18n-js";
import {ThemeProps} from "../types";
import PopUpSelector, {PopUpSelectorActivator} from "./PopUpSelector";
import {PostSortingOrder, POST_SORTING_ORDERS} from "../model/groups";

// Component props
export type PostSortingOrderPickerProps = {
    order: PostSortingOrder;
    onChange?: (order: PostSortingOrder) => void;
    activator?: PopUpSelectorActivator;
} & ThemeProps;

class PostSortingOrderPicker extends React.Component<PostSortingOrderPickerProps> {
    render(): JSX.Element {
        const {onChange, order, activator} = this.props;

        return (
            <PopUpSelector
                values={POST_SORTING_ORDERS}
                label={(l: string) => i18n.t(`groups.postsSorting.${l}`)}
                selected={order ? [order] : []}
                onSelect={(values: string[]) => {
                    if (values.length > 0 && onChange) onChange(values[0] as PostSortingOrder);
                }}
                activator={activator}
                atLeastOne
            />
        );
    }
}

export default PostSortingOrderPicker;
