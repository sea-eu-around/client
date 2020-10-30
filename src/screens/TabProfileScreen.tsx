import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, View} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import Colors from "../constants/themes";
import {MainNavigatorTabs} from "../navigation/types";
import EditProfileForm from "../components/forms/EditProfileForm";
import {setProfileFields} from "../state/profile/actions";
import {MyProfileDto} from "../api/dto";

const mapStateToProps = (state: AppState) => ({
    theme: Colors[state.settings.theme],
    profile: state.profile.userProfile,
});
const reduxConnector = connect(mapStateToProps);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

type TabProfileScreenProps = ConnectedProps<typeof reduxConnector> & StackScreenProps<MainNavigatorTabs, "TabProfile">;

function TabProfileScreen({theme, profile, dispatch}: TabProfileScreenProps): JSX.Element {
    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <EditProfileForm
                profile={profile}
                onFieldChanged={(fields: Partial<MyProfileDto>) => {
                    dispatch(setProfileFields(fields));
                }}
            ></EditProfileForm>
        </View>
    );
}

export default reduxConnector(TabProfileScreen);
