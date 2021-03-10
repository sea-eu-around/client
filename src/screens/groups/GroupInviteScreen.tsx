import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, Text} from "react-native";
import {withTheme} from "react-native-elements";
import {MyThunkDispatch} from "../../state/types";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import i18n from "i18n-js";
import {TabGroupsRoot} from "../../navigation/types";
import ScreenWrapper from "../ScreenWrapper";
import InfiniteScroller from "../../components/InfiniteScroller";
import {getRouteParams} from "../../navigation/utils";
import {UserProfile} from "../../model/user-profile";
import GroupProfileInviteCard from "../../components/cards/GroupProfileInviteCard";
import {fetchAvailableMatches} from "../../state/groups/actions";
import BufferedSearchBar from "../../components/BufferedSearchBar";
import {SEARCH_BUFFER_DELAY} from "../../constants/config";
import GroupProvider from "../../components/providers/GroupProvider";
import store from "../../state/store";

// Component props
type GroupInviteScreenProps = ThemeProps & StackScreenProps<TabGroupsRoot, "GroupInviteScreen">;

// Component state
type GroupInviteScreenState = {
    search: string;
    groupId: string | null;
};

class GroupInviteScreen extends React.Component<GroupInviteScreenProps, GroupInviteScreenState> {
    constructor(props: GroupInviteScreenProps) {
        super(props);
        this.state = {search: "", groupId: null};
    }

    componentDidMount(): void {
        const {navigation, route} = this.props;

        navigation.addListener("focus", () => {
            const groupId = getRouteParams(route).groupId as string;
            this.setState({...this.state, groupId});
        });
    }

    private fetch(): void {
        const dispatch = store.dispatch as MyThunkDispatch;
        const {groupId, search} = this.state;
        if (groupId) dispatch(fetchAvailableMatches(groupId, search));
    }

    render(): JSX.Element {
        const {theme, navigation} = this.props;
        const {search, groupId} = this.state;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <BufferedSearchBar
                    onBufferedUpdate={() => this.fetch()}
                    bufferDelay={SEARCH_BUFFER_DELAY}
                    placeholder={i18n.t("search")}
                    onChangeText={(search: string) => this.setState({...this.state, search})}
                    value={search}
                    containerStyle={styles.searchBarContainer}
                    inputContainerStyle={styles.searchBarInputContainer}
                    inputStyle={styles.searchBarInput}
                />
                <GroupProvider groupId={groupId} redirectIfNotApproved>
                    {({group}) =>
                        group && (
                            <InfiniteScroller
                                navigation={navigation}
                                fetchLimit={1}
                                fetchMore={() => this.fetch()}
                                fetching={group.availableMatches.fetching}
                                canFetchMore={group.availableMatches.profiles === null}
                                currentPage={1}
                                items={group.availableMatches.profiles || []}
                                id={(p: UserProfile): string => p.id}
                                hideScrollIndicator
                                noResultsComponent={
                                    <Text style={styles.noResultsText}>{i18n.t("groups.invite.nobodyToInvite")}</Text>
                                }
                                refresh={() => this.fetch()}
                                refreshOnFocus
                                renderItem={(p: UserProfile) => (
                                    <GroupProfileInviteCard key={`invite-${p.id}`} group={group} profile={p} />
                                )}
                                itemsContainerStyle={styles.itemsContainer}
                            />
                        )
                    }
                </GroupProvider>
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        itemsContainer: {
            width: "100%",
            maxWidth: 600,
            alignSelf: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: 10,
        },
        noResultsText: {
            fontSize: 16,
            color: theme.textLight,
            marginVertical: 5,
            textAlign: "center",
            maxWidth: 300,
        },
        // Search bar
        searchBarContainer: {
            width: "100%",
            marginBottom: 5,
            paddingVertical: 0,
            paddingHorizontal: 15,
            backgroundColor: "transparent",
            borderTopWidth: 0,
            borderBottomWidth: 0,
        },
        searchBarInputContainer: {
            height: 40,
            backgroundColor: theme.cardBackground,
            elevation: 2,
            borderRadius: 25,
        },
        searchBarInput: {
            fontSize: 14,
        },
    });
});

export default withTheme(GroupInviteScreen);
