import * as React from "react";
import {
    ActivityIndicator,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import {ThemeConsumer} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {ThemeProps} from "../types";

// Component props
export type InfiniteScrollerProps<T> = {
    items: T[];
    id: (item: T) => string;
    fetchMore: () => void;
    refresh: () => void;
    fetching: boolean;
    fetchLimit: number;
    renderItem: (item: T, hide: () => void) => JSX.Element;
    noResultsComponent: JSX.Element;
    currentPage: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigation: {isFocused: () => boolean; addListener: (k: any, l: () => void) => void};
    itemsContainerStyle?: StyleProp<ViewStyle>;
    progressViewOffset?: number;
    refreshOnFocus?: boolean;
};

// Component state
type InfiniteScrollerState = {
    hiddenIds: {[key: string]: boolean};
};

const SCROLL_DISTANCE_TO_LOAD = 50;

export default class InfiniteScroller<T> extends React.Component<InfiniteScrollerProps<T>, InfiniteScrollerState> {
    scrollViewRef: React.RefObject<ScrollView> = React.createRef<ScrollView>();

    constructor(props: InfiniteScrollerProps<T>) {
        super(props);
        this.state = {hiddenIds: {}};
    }

    fetchMore(): void {
        const {fetching, fetchMore, navigation} = this.props;
        if (!fetching && navigation.isFocused()) fetchMore();
    }

    getShownItems(): T[] {
        const {items, id} = this.props;
        return items.filter((it) => !this.state.hiddenIds[id(it)]);
    }

    hideItem(item: T): void {
        const {fetchLimit, id} = this.props;
        this.setState({...this.state, hiddenIds: {...this.state.hiddenIds, [id(item)]: true}});
        if (this.getShownItems().length < fetchLimit) this.fetchMore();
    }

    componentDidMount(): void {
        const {navigation} = this.props;
        navigation.addListener("focus", () => this.onFocus());
        this.onFocus();
    }

    onFocus(): void {
        const {items, fetchLimit, fetching, refreshOnFocus, currentPage, refresh, id} = this.props;
        const shown = items.filter((it) => !this.state.hiddenIds[id(it)]).length;

        if (refreshOnFocus) {
            // Fetch items if currentPage is 1 (because this won't be caught by 'justRefreshed' in componentDidUpdate)
            if (currentPage === 1) this.fetchMore();
            else refresh(); // We don't refresh if the current page is 1 because that means we haven't fetched anything yet
        } else if (shown < fetchLimit && !fetching) this.fetchMore();
    }

    componentDidUpdate(oldProps: InfiniteScrollerProps<T>): void {
        const {fetchLimit, currentPage, navigation} = this.props;

        const justRefreshed = oldProps.currentPage > 1 && currentPage === 1;

        if (navigation.isFocused()) {
            if (this.getShownItems().length < fetchLimit) this.fetchMore();
            // Reset the hidden profiles when the user purposedly refreshes
            if (justRefreshed) this.setState({...this.state, hiddenIds: {}});
        }
    }

    render(): JSX.Element {
        const {
            items,
            fetching,
            currentPage,
            refresh,
            renderItem,
            noResultsComponent,
            itemsContainerStyle,
            progressViewOffset,
        } = this.props;

        return (
            <ThemeConsumer>
                {({theme}: ThemeProps) => {
                    const styles = themedStyles(theme);
                    return (
                        <ScrollView
                            ref={this.scrollViewRef}
                            style={styles.scroller}
                            contentContainerStyle={[styles.itemsContainer, itemsContainerStyle]}
                            refreshControl={
                                <RefreshControl
                                    progressViewOffset={progressViewOffset}
                                    refreshing={fetching}
                                    onRefresh={() => {
                                        if (!fetching) refresh();
                                    }}
                                />
                            }
                            onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                                const {layoutMeasurement, contentOffset, contentSize} = e.nativeEvent;
                                const distanceToBottom =
                                    contentSize.height - contentOffset.y - layoutMeasurement.height;
                                if (distanceToBottom < SCROLL_DISTANCE_TO_LOAD) this.fetchMore();
                            }}
                        >
                            {this.getShownItems().map((it: T) => renderItem(it, () => this.hideItem(it)))}
                            <View style={styles.loadingIndicatorContainer}>
                                {fetching && currentPage > 1 && items.length > 0 && (
                                    <ActivityIndicator size="large" color={theme.accentSecondary} />
                                )}
                            </View>
                            {!fetching && items.length == 0 && (
                                <View style={styles.noResultsContainer}>{noResultsComponent}</View>
                            )}
                        </ScrollView>
                    );
                }}
            </ThemeConsumer>
        );
    }
}

const themedStyles = preTheme((/*theme: Theme*/) => {
    return StyleSheet.create({
        scroller: {
            width: "100%",
        },
        itemsContainer: {},
        loadingIndicatorContainer: {
            marginVertical: 10,
            height: 50,
        },
        noResultsContainer: {
            flex: 1,
            alignItems: "center",
        },
    });
});
