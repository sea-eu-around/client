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
import MatchSuccessModal, {MatchSuccessModalClass} from "../components/modals/MatchSuccessModal";
import {MatchActionStatus} from "../api/dto";
import layout from "../constants/layout";

const reduxConnector = connect((state: AppState) => ({
    profiles: state.matching.fetchedProfiles,
    fetchingProfiles: state.matching.profilesPagination.fetching,
    canFetchMore: state.matching.profilesPagination.canFetchMore,
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
        const {
            profiles,
            theme,
            fetchingProfiles,
            canFetchMore,
            isFirstLaunch,
            currentPage,
            navigation,
            dispatch,
        } = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper forceFullWidth>
                <InfiniteScroller
                    ref={this.scrollerRef}
                    navigation={navigation}
                    fetchLimit={PROFILES_FETCH_LIMIT}
                    fetchMore={() => (dispatch as MyThunkDispatch)(fetchProfiles())}
                    fetching={fetchingProfiles}
                    canFetchMore={canFetchMore}
                    // refreshOnFocus={true}
                    currentPage={currentPage}
                    items={profiles}
                    id={(profile: UserProfile): string => profile.id}
                    noResultsComponent={
                        <>
                            <Text style={styles.noResultsText1}>{i18n.t("matching.noResults")}</Text>
                            <Text style={styles.noResultsText2}>{i18n.t("matching.noItemsAdvice")}</Text>
                        </>
                    }
                    endOfItemsComponent={
                        <>
                            <Text style={styles.noResultsText1}>{i18n.t("matching.noMoreItems")}</Text>
                            <Text style={styles.noResultsText2}>{i18n.t("matching.noItemsAdvice")}</Text>
                        </>
                    }
                    refresh={() => dispatch(refreshFetchedProfiles())}
                    renderItem={(profile: UserProfile, hide: () => void) => (
                        <MatchProfileCard
                            key={`match-profile-card-${profile.id}`}
                            profile={profile}
                            onExpand={(layout: LayoutRectangle) => {
                                const scroll = this.scrollerRef.current?.scrollViewRef.current;
                                if (scroll) scroll.scrollTo({y: layout.y - 100, animated: true});
                            }}
                            onSwipeRight={async () => {
                                const response = await (dispatch as MyThunkDispatch)(likeProfile(profile));
                                if (response && response.status === MatchActionStatus.Matched)
                                    this.successModalRef.current?.show(profile, response.roomId);
                            }}
                            onSwipeLeft={() => (dispatch as MyThunkDispatch)(dislikeProfile(profile))}
                            onHidden={() => hide()}
                            showSwipeTip={profile.id == profiles[0].id && (isFirstLaunch || layout.isWideDevice)}
                        />
                    )}
                    // Compensate for the header
                    itemsContainerStyle={styles.itemsContainer}
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
        itemsContainer: {
            width: "100%",
            maxWidth: 600,
            alignSelf: "center",
            paddingTop: 100,
            paddingBottom: 25,
        },
    });
});

export default reduxConnector(withTheme(TabMatchingScreen));
