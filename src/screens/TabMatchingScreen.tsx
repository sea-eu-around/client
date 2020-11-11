import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {LayoutRectangle, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View} from "react-native";
import {withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {UserProfileDto} from "../api/dto";
import ProfilePreview from "../components/ProfilePreview";
import {TabMatchingParamList} from "../navigation/types";
import {fetchProfiles} from "../state/profile/actions";
import {AppState, MyThunkDispatch} from "../state/types";
import {preTheme} from "../styles/utils";
import {ThemeProps} from "../types";

const mapStateToProps = (state: AppState) => ({
    profiles: state.profile.fetchedProfiles,
    fetchingProfiles: state.profile.fetchingProfiles,
});
const reduxConnector = connect(mapStateToProps);

// Component props
type TabMatchingScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<TabMatchingParamList, "TabMatchingScreen">;

// Component state
type TabMatchingScreenState = {
    hiddenProfiles: string[];
};

const SCROLL_DISTANCE_TO_LOAD = 50;

class TabMatchingScreen extends React.Component<TabMatchingScreenProps, TabMatchingScreenState> {
    scrollViewRef: React.RefObject<ScrollView>;

    constructor(props: TabMatchingScreenProps) {
        super(props);
        this.state = {hiddenProfiles: []};
        this.scrollViewRef = React.createRef<ScrollView>();
    }

    hideProfile(id: string) {
        this.setState({...this.state, hiddenProfiles: this.state.hiddenProfiles.concat(id)});
    }

    componentDidMount() {
        (this.props.dispatch as MyThunkDispatch)(fetchProfiles());
    }

    render(): JSX.Element {
        const {profiles, theme, fetchingProfiles} = this.props;
        const styles = themedStyles(theme);

        console.log(this.state.hiddenProfiles);
        const isNotHidden = (profile: UserProfileDto) => this.state.hiddenProfiles.indexOf(profile.id) == -1;

        const previewComponents = profiles
            .filter((profile) => isNotHidden(profile))
            .map((profile: UserProfileDto) => (
                <ProfilePreview
                    key={profile.id}
                    profile={profile}
                    onExpand={(layout: LayoutRectangle) => {
                        const scroll = this.scrollViewRef.current;
                        if (scroll) scroll.scrollTo({y: layout.y, animated: true});
                    }}
                    onSwipeRight={() => {
                        //this.hideProfile(profile.id);
                    }}
                    onSwipeLeft={() => {
                        //this.hideProfile(profile.id);
                    }}
                    //style={{marginVertical: 10}}
                />
            ));

        return (
            <View style={styles.container}>
                <ScrollView
                    ref={this.scrollViewRef}
                    style={styles.scroller}
                    scrollToOverflowEnabled={true}
                    onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                        const {layoutMeasurement, contentOffset, contentSize} = e.nativeEvent;
                        const distanceToBottom = contentSize.height - contentOffset.y - layoutMeasurement.height;
                        if (!fetchingProfiles && distanceToBottom < SCROLL_DISTANCE_TO_LOAD)
                            (this.props.dispatch as MyThunkDispatch)(fetchProfiles());
                    }}
                >
                    <View style={styles.matchContainer}>{previewComponents}</View>
                </ScrollView>
            </View>
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            height: "100%",
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
    });
});

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
