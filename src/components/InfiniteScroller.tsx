import * as React from "react";
import {
    ActivityIndicator,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
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
};

type InternalInfiniteScrollerProps<T> = ThemeProps & InfiniteScrollerProps<T>;

// Component state
type InfiniteScrollerState = {
    hiddenIds: {[key: string]: boolean};
};

const SCROLL_DISTANCE_TO_LOAD = 50;

class InfiniteScrollerClass<T> extends React.Component<InternalInfiniteScrollerProps<T>, InfiniteScrollerState> {
    scrollViewRef: React.RefObject<ScrollView> = React.createRef<ScrollView>();

    constructor(props: InternalInfiniteScrollerProps<T>) {
        super(props);
        this.state = {hiddenIds: {}};
    }

    fetchMore(): void {
        const {fetching, fetchMore} = this.props;
        if (!fetching /*&& navigation.isFocused()*/) fetchMore();
    }

    hideItem(item: T): void {
        this.setState({...this.state, hiddenIds: {...this.state.hiddenIds, [this.props.id(item)]: true}});
    }

    componentDidMount(): void {
        const numberShown = this.props.items.length - Object.keys(this.state.hiddenIds).length;
        if (numberShown == 0) this.fetchMore();
    }

    componentDidUpdate(oldProps: InfiniteScrollerProps<T>): void {
        const {fetchLimit, currentPage, id} = this.props;

        const justRefreshed = oldProps.currentPage > 1 && currentPage === 1;
        if (true /*this.props.navigation.isFocused()*/) {
            const shown = this.props.items.filter((it) => !this.state.hiddenIds[id(it)]).length;
            if (shown < fetchLimit) this.fetchMore();
            // Reset the hidden profiles when the user purposedly refreshes
            if (justRefreshed) this.setState({...this.state, hiddenIds: {}});
        }
    }

    render(): JSX.Element {
        const {theme, items, fetching, refresh, renderItem, noResultsComponent, id} = this.props;
        const {hiddenIds} = this.state;
        const styles = themedStyles(theme);

        return (
            <ScrollView
                ref={this.scrollViewRef}
                style={styles.scroller}
                refreshControl={<RefreshControl refreshing={fetching} onRefresh={() => refresh()} />}
                onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                    const {layoutMeasurement, contentOffset, contentSize} = e.nativeEvent;
                    const distanceToBottom = contentSize.height - contentOffset.y - layoutMeasurement.height;
                    if (distanceToBottom < SCROLL_DISTANCE_TO_LOAD) this.fetchMore();
                }}
            >
                <View style={styles.itemsContainer}>
                    {items
                        .filter((it: T) => !hiddenIds[id(it)])
                        .map((it: T) => renderItem(it, () => this.hideItem(it)))}
                    <View style={styles.loadingIndicatorContainer}>
                        {fetching && items.length > 0 && (
                            <ActivityIndicator size="large" color={theme.accentSecondary} />
                        )}
                    </View>
                    {!fetching && items.length == 0 && (
                        <View style={styles.noResultsContainer}>{noResultsComponent}</View>
                    )}
                </View>
            </ScrollView>
        );
    }
}

const themedStyles = preTheme((/*theme: Theme*/) => {
    return StyleSheet.create({
        scroller: {
            width: "100%",
        },
        itemsContainer: {
            flex: 1,
            borderStyle: "solid",
            borderColor: "red",
            borderWidth: 0,
        },
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

export default function InfiniteScroller<T>(props: InfiniteScrollerProps<T>): JSX.Element {
    return (
        <ThemeConsumer>
            {(themeProps: ThemeProps) => <InfiniteScrollerClass {...props} {...themeProps} />}
        </ThemeConsumer>
    );
}
