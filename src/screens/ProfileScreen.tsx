import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {connect, ConnectedProps} from "react-redux";
import {MyThunkDispatch} from "../state/types";
import {RootNavigatorScreens} from "../navigation/types";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import ProfileView from "../components/ProfileView";
import {UserProfile, UserProfileWithMatchInfo} from "../model/user-profile";
import {fetchProfile} from "../state/profile/actions";
import ScreenWrapper from "./ScreenWrapper";
import ProfileActionBar from "../components/ProfileActionBar";
import {getRouteParams} from "../navigation/utils";

const reduxConnector = connect(() => ({}));

// Component props
type ProfileScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps & StackScreenProps<RootNavigatorScreens>;

// Component state
type ProfileScreenState = {
    profile: UserProfile | null;
    isMatched: boolean;
    roomId: string | null;
    matchId: string | null;
};

class ProfileScreen extends React.Component<ProfileScreenProps, ProfileScreenState> {
    constructor(props: ProfileScreenProps) {
        super(props);
        this.state = {profile: null, isMatched: false, roomId: null, matchId: null};
    }

    componentDidMount() {
        const {dispatch, navigation, route} = this.props;

        navigation.addListener("focus", () => {
            const {id} = getRouteParams(route);
            if (id && (!this.state.profile || this.state.profile.id !== id)) {
                (dispatch as MyThunkDispatch)(fetchProfile(id as string)).then(
                    (profileWithMatchInfo: UserProfileWithMatchInfo | null) => {
                        if (profileWithMatchInfo) {
                            const {profile, isMatched, roomId, matchingId} = profileWithMatchInfo;
                            this.setState({...this.state, profile, isMatched, roomId, matchId: matchingId});
                        } else {
                            this.setState({
                                ...this.state,
                                profile: null,
                                isMatched: false,
                                roomId: null,
                                matchId: null,
                            });
                        }
                    },
                );
            }
        });
    }

    render(): JSX.Element {
        const {profile, isMatched, roomId, matchId} = this.state;

        return (
            <ScreenWrapper forceFullWidth>
                <ProfileView
                    profile={profile}
                    actionBar={
                        <ProfileActionBar profile={profile} isMatched={isMatched} roomId={roomId} matchId={matchId} />
                    }
                />
            </ScreenWrapper>
        );
    }
}

export default reduxConnector(withTheme(ProfileScreen));
