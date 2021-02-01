import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet} from "react-native";
import {withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {UserProfile} from "../model/user-profile";
import {AppState} from "../state/types";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import {TabGroupsRoot} from "../navigation/types";
import ScreenWrapper from "./ScreenWrapper";
import InfiniteScroller from "../components/InfiniteScroller";
import {MatchSuccessModalClass} from "../components/modals/MatchSuccessModal";
import MyGroupsView from "../components/MyGroupsView";
import {NavigationProp} from "@react-navigation/native";

const reduxConnector = connect((state: AppState) => ({}));

// Component props
type TabGroupsScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<TabGroupsRoot, "TabGroupsScreen">;

class TabGroupsScreen extends React.Component<TabGroupsScreenProps> {
    scrollerRef = React.createRef<InfiniteScroller<UserProfile>>();
    successModalRef = React.createRef<MatchSuccessModalClass>();

    render(): JSX.Element {
        const {theme, navigation} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <MyGroupsView navigation={(navigation as unknown) as NavigationProp<never>} />
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({});
});

export default reduxConnector(withTheme(TabGroupsScreen));
