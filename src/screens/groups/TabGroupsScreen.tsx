import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {UserProfile} from "../../model/user-profile";
import {TabGroupsRoot} from "../../navigation/types";
import ScreenWrapper from "../ScreenWrapper";
import InfiniteScroller from "../../components/InfiniteScroller";
import {MatchSuccessModalClass} from "../../components/modals/MatchSuccessModal";
import MyGroupsView from "../../components/MyGroupsView";
import {NavigationProp} from "@react-navigation/native";
import PostsFeedView from "../../components/PostsFeedView";
import GroupInvitesView from "../../components/GroupInvitesView";

// Component props
type TabGroupsScreenProps = StackScreenProps<TabGroupsRoot, "TabGroupsScreen">;

class TabGroupsScreen extends React.Component<TabGroupsScreenProps> {
    scrollerRef = React.createRef<InfiniteScroller<UserProfile>>();
    successModalRef = React.createRef<MatchSuccessModalClass>();

    render(): JSX.Element {
        const nav = (this.props.navigation as unknown) as NavigationProp<never>;

        return (
            <ScreenWrapper>
                <PostsFeedView
                    top={
                        <>
                            <MyGroupsView navigation={nav} />
                            <GroupInvitesView navigation={nav} />
                        </>
                    }
                    navigation={nav}
                />
            </ScreenWrapper>
        );
    }
}

export default TabGroupsScreen;
