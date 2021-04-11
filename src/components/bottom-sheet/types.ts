import {ThemeProps} from "../../types";

export type BottomSheetProps = {
    activator?: (show: () => void) => JSX.Element;
    snapPoints?: number[];
    renderContent: (hide: () => void) => JSX.Element;
} & ThemeProps;
