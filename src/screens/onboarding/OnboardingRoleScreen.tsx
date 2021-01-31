import * as React from "react";
import {StyleSheet, TouchableOpacity, View, Dimensions} from "react-native";
import {setOnboardingValues} from "../../state/auth/actions";
import {Role} from "../../constants/profile-constants";
import i18n from "i18n-js";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import {getLocalSvg} from "../../assets";

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

        const StudentBlob = getLocalSvg("blob-9", () => this.forceUpdate());
        const StudentSvg = getLocalSvg("student", () => this.forceUpdate());
        const StaffBlob = getLocalSvg("blob-8", () => this.forceUpdate());
        const StaffSvg = getLocalSvg("staff", () => this.forceUpdate());

        const svgHeight = (Dimensions.get("window").height - 300) / 2;

        return (
            <OnboardingSlide title={i18n.t("onboarding.role.title")} hideNavNext={true} {...this.props}>
                <View style={[styles.buttonsContainer, {maxWidth: svgHeight * 1.3}]}>
                    <TouchableOpacity
                        style={{alignSelf: "flex-start"}}
                        activeOpacity={0.8}
                        onPress={() => this.submit({type: "student"})}
                    >
                        <StudentBlob width={svgHeight * (300 / 280)} height={svgHeight} viewBox="0 0 300 280" />
                        <StudentSvg
                            style={{position: "absolute", left: svgHeight * 0.26, top: svgHeight * 0.1}}
                            width={svgHeight * 0.85 * (200 / 240)}
                            height={svgHeight * 0.85}
                            viewBox="0 0 200 240"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{alignSelf: "flex-end", marginTop: -20}}
                        activeOpacity={0.8}
                        onPress={() => this.submit({type: "staff"})}
                    >
                        <StaffBlob width={svgHeight * (290 / 305)} height={svgHeight} viewBox="0 0 290 305" />
                        <StaffSvg
                            style={{position: "absolute", right: svgHeight * 0.1, top: svgHeight * 0.12}}
                            width={svgHeight * 0.82 * (210 / 235)}
                            height={svgHeight * 0.82}
                            viewBox="0 0 210 235"
                        />
                    </TouchableOpacity>
                </View>
            </OnboardingSlide>
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        buttonsContainer: {
            width: "100%",
            alignSelf: "center",
        },
    });
});

export default reduxConnector(withTheme(OnboardingRoleScreen));
