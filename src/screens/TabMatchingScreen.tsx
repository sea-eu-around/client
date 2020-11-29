import {FontAwesome} from "@expo/vector-icons";
import {StackNavigationProp, StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {
    ActivityIndicator,
    LayoutRectangle,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {UserProfile} from "../model/user-profile";
import ProfilePreview from "../components/ProfilePreview";
import {dislikeProfile, fetchProfiles, likeProfile, refreshFetchedProfiles} from "../state/matching/actions";
import store from "../state/store";
import {AppState, MyThunkDispatch} from "../state/types";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";
import {TabMatchingRoot} from "../navigation/types";
import {PROFILES_FETCH_LIMIT} from "../constants/config";

const reduxConnector = connect((state: AppState) => ({
    profiles: state.matching.fetchedProfiles,
    fetchingProfiles: state.matching.profilesPagination.fetching,
    justRefreshed: state.matching.profilesPagination.page == 1,
}));

// Component props
type TabMatchingScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<TabMatchingRoot, "TabMatchingScreen">;

// Component state
type TabMatchingScreenState = {
    hiddenIds: {[key: string]: boolean};
};

const SCROLL_DISTANCE_TO_LOAD = 50;

class TabMatchingScreen extends React.Component<TabMatchingScreenProps, TabMatchingScreenState> {
    scrollViewRef: React.RefObject<ScrollView> = React.createRef<ScrollView>();

    constructor(props: TabMatchingScreenProps) {
        super(props);
        this.state = {hiddenIds: {}};
    }

    fetchMore() {
        (this.props.dispatch as MyThunkDispatch)(fetchProfiles());
    }

    hideProfile(p: UserProfile) {
        this.setState({...this.state, hiddenIds: {...this.state.hiddenIds, [p.id]: true}});
    }

    componentDidMount() {
        const shownProfiles = this.props.profiles.length - Object.keys(this.state.hiddenIds).length;
        if (shownProfiles == 0) this.fetchMore();
    }

    componentDidUpdate(oldProps: TabMatchingScreenProps) {
        const shownProfiles = this.props.profiles.filter((p) => !this.state.hiddenIds[p.id]).length;
        if (shownProfiles < PROFILES_FETCH_LIMIT) this.fetchMore();
        // Reset the hidden profiles when the user purposedly refreshes
        if (!oldProps.justRefreshed && this.props.justRefreshed) this.setState({...this.state, hiddenIds: {}});
    }

    render(): JSX.Element {
        const {profiles, theme, fetchingProfiles, dispatch} = this.props;
        const {hiddenIds} = this.state;
        const styles = themedStyles(theme);

        const previewComponents = profiles
            .filter((p) => !hiddenIds[p.id])
            .map((profile: UserProfile) => (
                <ProfilePreview
                    key={profile.id}
                    profile={profile}
                    onExpand={(layout: LayoutRectangle) => {
                        const scroll = this.scrollViewRef.current;
                        if (scroll) scroll.scrollTo({y: layout.y, animated: true});
                    }}
                    onSwipeRight={() => (dispatch as MyThunkDispatch)(likeProfile(profile.id))}
                    onSwipeLeft={() => (dispatch as MyThunkDispatch)(dislikeProfile(profile.id))}
                    onHidden={() => this.hideProfile(profile)}
                />
            ));

        return (
            <View style={styles.container}>
                <ScrollView
                    ref={this.scrollViewRef}
                    style={styles.scroller}
                    refreshControl={
                        <RefreshControl
                            refreshing={fetchingProfiles}
                            onRefresh={() => store.dispatch(refreshFetchedProfiles())}
                        />
                    }
                    onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                        const {layoutMeasurement, contentOffset, contentSize} = e.nativeEvent;
                        const distanceToBottom = contentSize.height - contentOffset.y - layoutMeasurement.height;
                        if (!fetchingProfiles && distanceToBottom < SCROLL_DISTANCE_TO_LOAD) this.fetchMore();
                    }}
                >
                    <View style={styles.matchContainer}>
                        {previewComponents}
                        <View style={styles.loadingIndicatorContainer}>
                            {fetchingProfiles && profiles.length > 0 && (
                                <ActivityIndicator size="large" color={theme.accentSecondary} />
                            )}
                        </View>
                        {!fetchingProfiles && previewComponents.length == 0 && (
                            <View style={styles.noResultsContainer}>
                                <Text style={styles.noResultsText1}>{i18n.t("matching.noResults")}</Text>
                                <Text style={styles.noResultsText2}>{i18n.t("matching.noResultsAdvice")}</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: theme.background,
        },
        topBar: {
            flexBasis: 90,
            paddingTop: 40,
            paddingHorizontal: 20,
            width: "100%",
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
        },
        separator: {
            marginVertical: 20,
            height: 1,
            width: "100%",
        },
        scroller: {
            width: "100%",
        },
        matchContainer: {
            flex: 1,
            borderStyle: "solid",
            borderColor: "red",
            borderWidth: 0,
        },
        loadingIndicatorContainer: {
            marginVertical: 10,
            height: 50,
        },
        filtersIcon: {
            paddingHorizontal: 5,
            fontSize: 26,
            color: theme.textLight,
        },
        headerContainer: {
            flexDirection: "row",
            paddingRight: 10,
        },
        noResultsContainer: {
            flex: 1,
            alignItems: "center",
        },
        noResultsText1: {
            fontSize: 20,
            letterSpacing: 0.75,
            color: theme.text,
            marginVertical: 5,
        },
        noResultsText2: {
            fontSize: 16,
            letterSpacing: 0.5,
            color: theme.text,
        },
    });
});

type MatchingHeaderRightProps = {
    navigation: StackNavigationProp<TabMatchingRoot, "TabMatchingScreen">;
} & ThemeProps;

export const MatchingHeaderRight = withTheme(
    ({navigation, theme}: MatchingHeaderRightProps): JSX.Element => {
        const styles = themedStyles(theme);
        return (
            <View style={styles.headerContainer}>
                {/*<TouchableOpacity onPress={() => store.dispatch(refreshFetchedProfiles())}>
                <MaterialIcons name="refresh" size={32} />
            </TouchableOpacity>*/}
                <TouchableOpacity onPress={() => navigation.navigate("MatchFilteringScreen")}>
                    <FontAwesome name="sliders" style={styles.filtersIcon} />
                </TouchableOpacity>
            </View>
        );
    },
);

export default reduxConnector(withTheme(TabMatchingScreen));
