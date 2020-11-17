import * as React from "react";
import {Text, ViewStyle, StyleSheet} from "react-native";
import {setOnboardingValues} from "../../state/auth/actions";
import {TouchableOpacity} from "react-native-gesture-handler";
import {Role} from "../../constants/profile-constants";
import i18n from "i18n-js";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import {MaterialIcons} from "@expo/vector-icons";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import store from "../../state/store";
import {preTheme} from "../../styles/utils";

type OnboardingRoleScreenProps = ThemeProps & OnboardingScreenProps;

type OnboardingRoleFormState = {
    role: Role;
};

class OnboardingRoleScreen extends React.Component<OnboardingRoleScreenProps> {
    submit(values: OnboardingRoleFormState) {
        store.dispatch(setOnboardingValues(values));
        this.props.next();
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <OnboardingSlide title={i18n.t("onboarding.role.title")} hideNavNext={true} {...this.props}>
                <TouchableOpacity style={styles.roleButton} onPress={() => this.submit({role: "student"})}>
                    <MaterialIcons name={"school"} style={styles.roleButtonIconStudent}></MaterialIcons>
                    <Text style={styles.roleButtonTextStudent}>{i18n.t("allRoles.student")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.roleButton} onPress={() => this.submit({role: "staff"})}>
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
            fontFamily: "sans-serif-thin",
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

export default withTheme(OnboardingRoleScreen);
