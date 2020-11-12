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
    TouchableOpacity,
    View,
} from "react-native";
import {withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {UserProfileDto} from "../api/dto";
import ProfilePreview from "../components/ProfilePreview";
import {TabMatchingParamList} from "../navigation/types";
import {dislikeProfile, likeProfile} from "../state/matching/actions";
import {fetchProfiles, refreshFetchedProfiles} from "../state/profile/actions";
import store from "../state/store";
import {AppState, MyThunkDispatch} from "../state/types";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";

const mapStateToProps = (state: AppState) => ({
    profiles: state.profile.fetchedProfiles,
    fetchingProfiles: state.profile.fetchingProfiles,
    justRefreshed: state.profile.fetchingPage == 1,
});
const reduxConnector = connect(mapStateToProps);

// Component props
type TabMatchingScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<TabMatchingParamList, "TabMatchingScreen">;

// Component state
type TabMatchingScreenState = {
    hiddenProfiles: {[key: string]: boolean};
};

const SCROLL_DISTANCE_TO_LOAD = 50;

class TabMatchingScreen extends React.Component<TabMatchingScreenProps, TabMatchingScreenState> {
    scrollViewRef: React.RefObject<ScrollView>;

    constructor(props: TabMatchingScreenProps) {
        super(props);
        this.state = {hiddenProfiles: {}};
        this.scrollViewRef = React.createRef<ScrollView>();
    }

    fetchMore() {
        (this.props.dispatch as MyThunkDispatch)(fetchProfiles());
    }

    hideProfile(id: string) {
        this.setState({...this.state, hiddenProfiles: {...this.state.hiddenProfiles, [id]: true}});
    }

    componentDidMount() {
        if (this.props.profiles.length == 0) this.fetchMore();
    }

    componentDidUpdate(oldProps: TabMatchingScreenProps) {
        if (this.props.profiles.length == 0) this.fetchMore();
        // Reset the hidden profiles when the user purposedly refreshes
        if (!oldProps.justRefreshed && this.props.justRefreshed) this.setState({...this.state, hiddenProfiles: {}});
    }

    render(): JSX.Element {
        const {profiles, theme, fetchingProfiles, dispatch} = this.props;
        const {hiddenProfiles} = this.state;
        const styles = themedStyles(theme);

        const previewComponents = profiles
            .filter((profile) => !hiddenProfiles[profile.id])
            .map((profile: UserProfileDto) => (
                <ProfilePreview
                    key={profile.id}
                    profile={profile}
                    onExpand={(layout: LayoutRectangle) => {
                        const scroll = this.scrollViewRef.current;
                        if (scroll) scroll.scrollTo({y: layout.y, animated: true});
                    }}
                    onSwipeRight={() => (dispatch as MyThunkDispatch)(likeProfile(profile.id))}
                    onSwipeLeft={() => (dispatch as MyThunkDispatch)(dislikeProfile(profile.id))}
                    onHidden={() => this.hideProfile(profile.id)}
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
    });
});

type MatchingHeaderRightProps = {
    navigation: StackNavigationProp<TabMatchingParamList, "TabMatchingScreen">;
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

/*

<View style={styles.container}>
    <View style={styles.topBar}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.title}>Matchingg</Text>
            <FontAwesome
                name="sliders"
                size={30}
                style={{paddingHorizontal: 4}}
                onPress={() => {
                    navigation.navigate("MatchFilteringScreen");
                }}
            />
        </View>
        <View style={[styles.separator, {backgroundColor: "#ccc"}]} />
    </View>
    <View style={styles.scroller}>
        <View style={styles.matchContainer}>

        </View>
    </View>
</View>

*/
