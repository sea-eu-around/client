import * as React from "react";
import {Text, ViewStyle} from "react-native";
import themes from "../../constants/themes";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {setOnboardingValues} from "../../state/auth/actions";
import {OnboardingProps} from ".";
import {TouchableOpacity} from "react-native-gesture-handler";
import {Role} from "../../constants/profile-constants";
import i18n from "i18n-js";
import OnboardingSlide from "./OnboardingSlide";
import {MaterialIcons} from "@expo/vector-icons";

const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
}));

type OnboardingRoleScreenProps = ConnectedProps<typeof reduxConnector> & OnboardingProps;

type OnboardingRoleFormState = {
    role: Role;
};

class OnboardingRoleScreen extends React.Component<OnboardingRoleScreenProps> {
    submit(values: OnboardingRoleFormState) {
        this.props.dispatch(setOnboardingValues(values));
        this.props.next();
    }

    render(): JSX.Element {
        const {theme} = this.props;

        const styles = {
            roleButton: {
                height: 100,
                flexDirection: "row",
                alignItems: "center",
            } as ViewStyle,
            roleButtonText: {
                fontFamily: "sans-serif-thin",
                fontSize: 40,
                letterSpacing: 1.75,
            },
            roleButtonIcon: {
                fontSize: 50,
                marginRight: 15,
            },
        };

        const studentColor = theme.accent;
        const staffColor = theme.okay;

        return (
            <OnboardingSlide title={i18n.t("onboarding.role.title")} hideNavNext={true} {...this.props}>
                <TouchableOpacity style={styles.roleButton} onPress={() => this.submit({role: "student"})}>
                    <MaterialIcons
                        name={"school"}
                        style={[styles.roleButtonIcon, {color: studentColor}]}
                    ></MaterialIcons>
                    <Text style={[styles.roleButtonText, {color: studentColor}]}>{i18n.t("roles.student")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.roleButton} onPress={() => this.submit({role: "staff"})}>
                    <MaterialIcons name={"group"} style={[styles.roleButtonIcon, {color: staffColor}]}></MaterialIcons>
                    <Text style={[styles.roleButtonText, {color: staffColor}]}>{i18n.t("roles.staff")}</Text>
                </TouchableOpacity>
            </OnboardingSlide>
        );
    }
}

export default reduxConnector(OnboardingRoleScreen);
