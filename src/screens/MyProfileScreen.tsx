import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {connect, ConnectedProps} from "react-redux";
import {AppState, MyThunkDispatch} from "../state/types";
import {RootNavigatorScreens} from "../navigation/types";
import EditProfileForm from "../components/forms/EditProfileForm";
import {ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {fetchUser, setProfileFields} from "../state/profile/actions";
import ScreenWrapper from "./ScreenWrapper";

const reduxConnector = connect((state: AppState) => ({
    user: state.profile.user,
}));

type MyProfileScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<RootNavigatorScreens, "MyProfileScreen">;

class MyProfileScreen extends React.Component<MyProfileScreenProps> {
    componentDidMount() {
        this.props.navigation.addListener("focus", () => this.onFocus());
        this.onFocus();
    }

    onFocus() {
        (this.props.dispatch as MyThunkDispatch)(fetchUser());
    }

    render(): JSX.Element {
        const {user, dispatch} = this.props;

        return (
            <ScreenWrapper forceFullWidth>
                <EditProfileForm
                    user={user}
                    onChange={(fields) => (dispatch as MyThunkDispatch)(setProfileFields(fields))}
                />
            </ScreenWrapper>
        );
    }
}

export default reduxConnector(withTheme(MyProfileScreen));
