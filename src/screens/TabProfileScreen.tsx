import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, View} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {AppState, MyThunkDispatch} from "../state/types";
import {MainNavigatorTabs} from "../navigation/types";
import EditProfileForm from "../components/forms/EditProfileForm";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {fetchUser, setProfileFields} from "../state/profile/actions";

const reduxConnector = connect((state: AppState) => ({
    user: state.profile.user,
}));

type TabProfileScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<MainNavigatorTabs, "TabProfile">;

class TabProfileScreen extends React.Component<TabProfileScreenProps> {
    componentDidMount() {
        this.props.navigation.addListener("focus", () => this.onFocus());
        this.onFocus();
    }

    onFocus() {
        (this.props.dispatch as MyThunkDispatch)(fetchUser());
    }

    render(): JSX.Element {
        const {theme, user, dispatch} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.container}>
                <EditProfileForm
                    user={user}
                    onChange={(fields) => (dispatch as MyThunkDispatch)(setProfileFields(fields))}
                ></EditProfileForm>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: theme.background,
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
        },
    });
});

export default reduxConnector(withTheme(TabProfileScreen));
