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

const reduxConnector = connect(() => ({}));

// Component props
type ProfileScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps & StackScreenProps<RootNavigatorScreens>;

// Component state
type ProfileScreenState = {profile: UserProfile | null; isMatched: boolean; roomId: string | null};

class ProfileScreen extends React.Component<ProfileScreenProps, ProfileScreenState> {
    constructor(props: ProfileScreenProps) {
        super(props);
        this.state = {profile: null, isMatched: false, roomId: null};
    }

    getRouteParams(): {[key: string]: string | boolean | number} {
        const params = this.props.route.params;
        return params ? (params as {[key: string]: string | boolean | number}) : {};
    }

    componentDidMount() {
        const {dispatch, navigation} = this.props;

        navigation.addListener("focus", () => {
            const {id} = this.getRouteParams();
            if (id && (!this.state.profile || this.state.profile.id !== id)) {
                (dispatch as MyThunkDispatch)(fetchProfile(id as string)).then(
                    (profileWithMatchInfo: UserProfileWithMatchInfo | null) => {
                        if (profileWithMatchInfo) {
                            const {profile, isMatched, roomId} = profileWithMatchInfo;
                            this.setState({...this.state, profile, isMatched, roomId});
                        } else this.setState({...this.state, profile: null, isMatched: false, roomId: null});
                    },
                );
            }
        });
    }

    render(): JSX.Element {
        const {profile, isMatched, roomId} = this.state;

        return (
            <ScreenWrapper forceFullWidth>
                <ProfileView
                    profile={profile}
                    actionBar={<ProfileActionBar profile={profile} isMatched={isMatched} roomId={roomId} />}
                />
            </ScreenWrapper>
        );
    }
}

export default reduxConnector(withTheme(ProfileScreen));
