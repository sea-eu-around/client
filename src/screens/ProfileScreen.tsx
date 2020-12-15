import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {connect, ConnectedProps} from "react-redux";
import {MyThunkDispatch} from "../state/types";
import {RootNavigatorScreens} from "../navigation/types";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import ProfileView from "../components/ProfileView";
import {UserProfile} from "../model/user-profile";
import {fetchProfile} from "../state/profile/actions";
import ScreenWrapper from "./ScreenWrapper";
import ProfileActionBar from "../components/ProfileActionBar";

const reduxConnector = connect(() => ({}));

// Component props
type ProfileScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps & StackScreenProps<RootNavigatorScreens>;

// Component state
type ProfileScreenState = {profile: UserProfile | null};

class ProfileScreen extends React.Component<ProfileScreenProps, ProfileScreenState> {
    constructor(props: ProfileScreenProps) {
        super(props);
        this.state = {profile: null};
    }

    getRouteParams(): {[key: string]: string} {
        const params = this.props.route.params;
        return params ? (params as {[key: string]: string}) : {};
    }

    componentDidMount() {
        const {dispatch} = this.props;

        const {id} = this.getRouteParams();
        if (id)
            (dispatch as MyThunkDispatch)(fetchProfile(id)).then((profile) => this.setState({...this.state, profile}));
    }

    render(): JSX.Element {
        const {profile} = this.state;

        return (
            <ScreenWrapper>
                <ProfileView profile={profile} actionBar={<ProfileActionBar profile={profile} />} />
            </ScreenWrapper>
        );
    }
}

export default reduxConnector(withTheme(ProfileScreen));
