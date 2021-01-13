import * as React from "react";
import {Text, ViewStyle, StyleSheet, TouchableOpacity} from "react-native";
import {setOnboardingValues} from "../../state/auth/actions";
import {Role} from "../../constants/profile-constants";
import i18n from "i18n-js";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import {MaterialIcons} from "@expo/vector-icons";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {styleTextThin} from "../../styles/general";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";

const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
}));

type OnboardingRoleScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps & OnboardingScreenProps;

type OnboardingRoleFormState = {
    type: Role;
};

class OnboardingRoleScreen extends React.Component<OnboardingRoleScreenProps> {
    submit(values: OnboardingRoleFormState) {
        this.props.dispatch(setOnboardingValues(values));
        this.props.next();
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <OnboardingSlide title={i18n.t("onboarding.role.title")} hideNavNext={true} {...this.props}>
                <TouchableOpacity style={styles.roleButton} onPress={() => this.submit({type: "student"})}>
                    <MaterialIcons name={"school"} style={styles.roleButtonIconStudent}></MaterialIcons>
                    <Text style={styles.roleButtonTextStudent}>{i18n.t("allRoles.student")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.roleButton} onPress={() => this.submit({type: "staff"})}>
                    <MaterialIcons name={"group"} style={styles.roleButtonIconStaff}></MaterialIcons>
                    <Text style={styles.roleButtonTextStaff}>{i18n.t("allRoles.staff")}</Text>
                </TouchableOpacity>
            </OnboardingSlide>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    const studentColor = theme.accent;
    const staffColor = theme.okay;

    const common = StyleSheet.create({
        roleButtonText: {
            ...styleTextThin,
            fontSize: 40,
            letterSpacing: 1.75,
        },
        roleButtonIcon: {
            fontSize: 50,
            marginRight: 15,
        },
    });

    return StyleSheet.create({
        roleButton: {
            height: 100,
            flexDirection: "row",
            alignItems: "center",
        } as ViewStyle,
        roleButtonTextStaff: {
            ...common.roleButtonText,
            color: staffColor,
        },
        roleButtonTextStudent: {
            ...common.roleButtonText,
            color: studentColor,
        },
        roleButtonIconStaff: {
            ...common.roleButtonIcon,
            color: staffColor,
        },
        roleButtonIconStudent: {
            ...common.roleButtonIcon,
            color: studentColor,
        },
    });
});

export default reduxConnector(withTheme(OnboardingRoleScreen));
