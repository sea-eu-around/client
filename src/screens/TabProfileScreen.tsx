import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, View} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {MainNavigatorTabs} from "../navigation/types";
import EditProfileForm from "../components/forms/EditProfileForm";
import {setProfileFields} from "../state/profile/actions";
import {UserProfileDto} from "../api/dto";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";

const mapStateToProps = (state: AppState) => ({
    user: state.profile.user,
});
const reduxConnector = connect(mapStateToProps);

type TabProfileScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<MainNavigatorTabs, "TabProfile">;

class TabProfileScreen extends React.Component<TabProfileScreenProps> {
    render(): JSX.Element {
        const {theme, user, dispatch} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.container}>
                <EditProfileForm
                    user={user}
                    onFieldChanged={(fields: Partial<UserProfileDto>) => {
                        dispatch(setProfileFields(fields));
                    }}
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
