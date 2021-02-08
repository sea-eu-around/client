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
import LocaleAware from "./utility/LocaleAware";

// Component props
export type InfiniteScrollerProps<T> = {
    items: T[];
    id: (item: T) => string;
    fetchMore: () => void;
    refresh: () => void;
    fetching: boolean;
    canFetchMore: boolean;
    fetchLimit: number;
    renderItem: (item: T, hide: () => void) => JSX.Element;
    noResultsComponent: JSX.Element;
    endOfItemsComponent?: JSX.Element;
    currentPage: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigation: {isFocused: () => boolean; addListener: (k: any, l: () => void) => void};
    itemsContainerStyle?: StyleProp<ViewStyle>;
    progressViewOffset?: number;
    refreshOnFocus?: boolean;
    horizontal?: boolean;
    hideScrollIndicator?: boolean;
};

// Component state
type InfiniteScrollerState = {
    hiddenIds: {[key: string]: boolean};
};

const SCROLL_DISTANCE_TO_LOAD = 150; //50;

export default class InfiniteScroller<T> extends React.Component<InfiniteScrollerProps<T>, InfiniteScrollerState> {
    scrollViewRef: React.RefObject<ScrollView> = React.createRef<ScrollView>();

    constructor(props: InfiniteScrollerProps<T>) {
        super(props);
        this.state = {hiddenIds: {}};
    }

    fetchMore(): void {
        const {fetching, canFetchMore, fetchMore, navigation} = this.props;
        if (!fetching && canFetchMore && navigation.isFocused()) fetchMore();
    }

    getShownItems(): T[] {
        const {items, id} = this.props;
        return items.filter((it) => !this.state.hiddenIds[id(it)]);
    }

    hideItem(item: T): void {
        const {fetchLimit, canFetchMore, id} = this.props;
        this.setState({...this.state, hiddenIds: {...this.state.hiddenIds, [id(item)]: true}});
        if (this.getShownItems().length < fetchLimit && canFetchMore) this.fetchMore();
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
            const moreIfNeeded = () => this.getShownItems().length < fetchLimit && this.fetchMore();
            // Reset the hidden profiles when the user purposedly refreshes
            if (justRefreshed) this.setState({...this.state, hiddenIds: {}}, moreIfNeeded);
            else moreIfNeeded();
        }
    }

    render(): JSX.Element {
        const {
            items,
            fetching,
            canFetchMore,
            currentPage,
            refresh,
            renderItem,
            noResultsComponent,
            endOfItemsComponent,
            itemsContainerStyle,
            progressViewOffset,
            horizontal,
            hideScrollIndicator,
        } = this.props;

        return (
            <>
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
                                    const distanceToEnd = horizontal
                                        ? contentSize.width - contentOffset.x - layoutMeasurement.width
                                        : contentSize.height - contentOffset.y - layoutMeasurement.height;
                                    if (distanceToEnd < SCROLL_DISTANCE_TO_LOAD) this.fetchMore();
                                }}
                                horizontal={horizontal}
                                {...(horizontal && {showsHorizontalScrollIndicator: !hideScrollIndicator})}
                                {...(!horizontal && {showsVerticalScrollIndicator: !hideScrollIndicator})}
                            >
                                {this.getShownItems().map((it: T) => renderItem(it, () => this.hideItem(it)))}
                                {!fetching && items.length > 0 && !canFetchMore && (
                                    <View style={styles.endOfItemsContainer}>{endOfItemsComponent}</View>
                                )}
                                {!fetching && items.length == 0 && (
                                    <View style={styles.noResultsContainer}>{noResultsComponent}</View>
                                )}
                                <View style={styles.loadingIndicatorContainer}>
                                    {fetching && currentPage > 1 && items.length > 0 && (
                                        <ActivityIndicator size="large" color={theme.accentSecondary} />
                                    )}
                                </View>
                            </ScrollView>
                        );
                    }}
                </ThemeConsumer>
                <LocaleAware onLocaleChange={() => this.props.refresh()} />
            </>
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
            marginTop: 10,
            marginBottom: 20, // compensate for bottom tab bar
            height: 50,
        },
        noResultsContainer: {
            flex: 1,
            alignItems: "center",
            marginTop: 20,
        },
        endOfItemsContainer: {
            marginTop: 20,
            alignItems: "center",
        },
    });
});
