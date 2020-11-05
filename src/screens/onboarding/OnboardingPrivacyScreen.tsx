import * as React from "react";
import OnboardingSlide from "./OnboardingSlide";
import themes from "../../constants/themes";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {OnboardingProps} from ".";
import {Text, TouchableOpacity, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {tosSlideStyle} from "../../styles/onboarding";
import TOSDeclinedModal from "../../components/modals/TOSDeclinedModal";
import i18n from "i18n-js";
import TextLink from "../../components/TextLink";

// State-linked props
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
}));

// Component props
type OnboardingPrivacyScreenProps = ConnectedProps<typeof reduxConnector> & OnboardingProps;

// Component state
type OnboardingPrivacyScreenState = {
    declined: boolean;
};

class OnboardingPrivacyScreen extends React.Component<OnboardingPrivacyScreenProps, OnboardingPrivacyScreenState> {
    constructor(props: OnboardingPrivacyScreenProps) {
        super(props);
        this.state = {declined: false};
    }

    decline() {
        this.setState({...this.state, declined: true});
    }

    render(): JSX.Element {
        const {theme, next} = this.props;

        const {actionsWrapper, actionButtonText, actionButton, readMoreText} = tosSlideStyle;
        const declineColor = theme.error;
        const acceptColor = theme.accentSecondary;

        return (
            <OnboardingSlide
                title={i18n.t("onboarding.privacy.title")}
                subtitle={i18n.t("onboarding.privacy.subtitle")}
                hideNavNext={true}
                {...this.props}
            >
                <Text style={readMoreText}>
                    {i18n.t("privacy.readMore")[0]}
                    <TextLink onPress={() => console.log("press")} text={i18n.t("privacy.readMore")[1]} />
                    {i18n.t("privacy.readMore")[2]}
                </Text>

                <View style={actionsWrapper}>
                    <TouchableOpacity style={actionButton} onPress={() => this.decline()}>
                        <Text style={[actionButtonText, {color: declineColor}]}>{i18n.t("tos.decline")}</Text>
                        <MaterialIcons name="close" style={[actionButtonText, {color: declineColor}]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={actionButton} onPress={() => next()}>
                        <Text style={[actionButtonText, {color: acceptColor}]}>{i18n.t("tos.accept")}</Text>
                        <MaterialIcons name="check" style={[actionButtonText, {color: acceptColor}]} />
                    </TouchableOpacity>
                </View>

                {this.state.declined && (
                    <TOSDeclinedModal onHide={() => this.setState({...this.state, declined: false})}></TOSDeclinedModal>
                )}
            </OnboardingSlide>
        );
    }
}

export default reduxConnector(OnboardingPrivacyScreen);
