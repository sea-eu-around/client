import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet} from "react-native";
import {withTheme} from "react-native-elements";
import {UserProfile} from "../../model/user-profile";
import {preTheme} from "../../styles/utils";
import {ThemeProps} from "../../types";
import {TabGroupsRoot} from "../../navigation/types";
import ScreenWrapper from "../ScreenWrapper";
import InfiniteScroller from "../../components/InfiniteScroller";
import {MatchSuccessModalClass} from "../../components/modals/MatchSuccessModal";
import MyGroupsView from "../../components/MyGroupsView";
import {NavigationProp} from "@react-navigation/native";
import PostsFeedView from "../../components/PostsFeedView";
import GroupInvitesView from "../../components/GroupInvitesView";

// Component props
type TabGroupsScreenProps = ThemeProps & StackScreenProps<TabGroupsRoot, "TabGroupsScreen">;

class TabGroupsScreen extends React.Component<TabGroupsScreenProps> {
    scrollerRef = React.createRef<InfiniteScroller<UserProfile>>();
    successModalRef = React.createRef<MatchSuccessModalClass>();

    render(): JSX.Element {
        const {theme, navigation} = this.props;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <PostsFeedView
                    top={
                        <>
                            <MyGroupsView navigation={(navigation as unknown) as NavigationProp<never>} />
                            <GroupInvitesView navigation={(navigation as unknown) as NavigationProp<never>} />
                        </>
                    }
                    navigation={(navigation as unknown) as NavigationProp<never>}
                />
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({});
});

export default withTheme(TabGroupsScreen);
