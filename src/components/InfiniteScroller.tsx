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

    hideItem(item: T): void {
        const {items, fetchLimit, id} = this.props;
        this.setState({...this.state, hiddenIds: {...this.state.hiddenIds, [id(item)]: true}});
        const shown = items.filter((it) => !this.state.hiddenIds[id(it)]).length;
        if (shown < fetchLimit) this.fetchMore();
    }

    componentDidMount(): void {
        const {items, navigation, id} = this.props;
        const shown = items.filter((it) => !this.state.hiddenIds[id(it)]).length;
        if (shown == 0) this.fetchMore();
        navigation.addListener("focus", () => this.onFocus());
        this.onFocus();
    }

    onFocus(): void {
        const {items, fetchLimit, fetching} = this.props;
        if (items.length < fetchLimit && !fetching) this.fetchMore();
    }

    componentDidUpdate(oldProps: InfiniteScrollerProps<T>): void {
        const {fetchLimit, currentPage, id, navigation} = this.props;

        const justRefreshed = oldProps.currentPage > 1 && currentPage === 1;

        if (navigation.isFocused()) {
            const shown = this.props.items.filter((it) => !this.state.hiddenIds[id(it)]).length;
            if (shown < fetchLimit) this.fetchMore();
            // Reset the hidden profiles when the user purposedly refreshes
            if (justRefreshed) this.setState({...this.state, hiddenIds: {}});
        }
    }

    render(): JSX.Element {
        const {
            items,
            fetching,
            refresh,
            renderItem,
            noResultsComponent,
            id,
            itemsContainerStyle,
            progressViewOffset,
        } = this.props;
        const {hiddenIds} = this.state;

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
                                    onRefresh={() => refresh()}
                                />
                            }
                            onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                                const {layoutMeasurement, contentOffset, contentSize} = e.nativeEvent;
                                const distanceToBottom =
                                    contentSize.height - contentOffset.y - layoutMeasurement.height;
                                if (distanceToBottom < SCROLL_DISTANCE_TO_LOAD) this.fetchMore();
                            }}
                        >
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
        itemsContainer: {
            //flex: 1,
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
