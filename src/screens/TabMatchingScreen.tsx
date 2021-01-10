import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {LayoutRectangle, StyleSheet, Text} from "react-native";
import {withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {UserProfile} from "../model/user-profile";
import MatchProfileCard from "../components/cards/MatchProfileCard";
import {dislikeProfile, fetchProfiles, likeProfile, refreshFetchedProfiles} from "../state/matching/actions";
import {AppState, MyThunkDispatch} from "../state/types";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";
import {TabMatchingRoot} from "../navigation/types";
import {PROFILES_FETCH_LIMIT} from "../constants/config";
import ScreenWrapper from "./ScreenWrapper";
import InfiniteScroller from "../components/InfiniteScroller";
import MatchSuccessModal, {MatchSuccessModalClass} from "./MatchSuccessModal";

const reduxConnector = connect((state: AppState) => ({
    profiles: state.matching.fetchedProfiles,
    fetchingProfiles: state.matching.profilesPagination.fetching,
    currentPage: state.matching.profilesPagination.page,
    isFirstLaunch: state.settings.isFirstLaunch,
}));

// Component props
type TabMatchingScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<TabMatchingRoot, "TabMatchingScreen">;

class TabMatchingScreen extends React.Component<TabMatchingScreenProps> {
    scrollerRef = React.createRef<InfiniteScroller<UserProfile>>();
    successModalRef = React.createRef<MatchSuccessModalClass>();

    render(): JSX.Element {
        const {profiles, theme, fetchingProfiles, isFirstLaunch, currentPage, navigation, dispatch} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <InfiniteScroller
                    ref={this.scrollerRef}
                    navigation={navigation}
                    fetchLimit={PROFILES_FETCH_LIMIT}
                    fetchMore={() => (dispatch as MyThunkDispatch)(fetchProfiles())}
                    fetching={fetchingProfiles}
                    currentPage={currentPage}
                    items={profiles}
                    id={(profile: UserProfile): string => profile.id}
                    noResultsComponent={
                        <>
                            <Text style={styles.noResultsText1}>{i18n.t("matching.noResults")}</Text>
                            <Text style={styles.noResultsText2}>{i18n.t("matching.noResultsAdvice")}</Text>
                        </>
                    }
                    refresh={() => dispatch(refreshFetchedProfiles())}
                    renderItem={(profile: UserProfile, hide: () => void) => (
                        <MatchProfileCard
                            key={`match-profile-card-${profile.id}`}
                            profile={profile}
                            onExpand={(layout: LayoutRectangle) => {
                                // TODO temp
                                //const scroll = this.scrollerRef.current?.scrollViewRef.current;
                                //if (scroll) scroll.scrollTo({y: layout.y - 100, animated: true});
                                console.log("show");
                                this.successModalRef.current?.show(profile);
                            }}
                            onSwipeRight={() => (dispatch as MyThunkDispatch)(likeProfile(profile))}
                            onSwipeLeft={() => (dispatch as MyThunkDispatch)(dislikeProfile(profile))}
                            onHidden={() => hide()}
                            showSwipeTip={profile.id == profiles[0].id && isFirstLaunch}
                        />
                    )}
                    // Compensate for the header
                    itemsContainerStyle={{paddingTop: 100, paddingBottom: 25}}
                    progressViewOffset={100}
                />
                <MatchSuccessModal ref={this.successModalRef} />
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
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

export default reduxConnector(withTheme(TabMatchingScreen));
