import * as React from "react";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import {Text, TouchableOpacity, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {tosSlideStyle} from "../../styles/onboarding";
import TOSDeclinedModal from "../../components/modals/TOSDeclinedModal";
import i18n from "i18n-js";
import TextLink from "../../components/TextLink";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";

// Component props
type OnboardingPrivacyScreenProps = ThemeProps & OnboardingScreenProps;

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
        const styles = tosSlideStyle(theme);

        return (
            <OnboardingSlide
                title={i18n.t("onboarding.privacy.title")}
                subtitle={i18n.t("onboarding.privacy.subtitle")}
                hideNavNext={true}
                {...this.props}
            >
                <Text style={styles.readMoreText}>
                    {i18n.t("privacy.readMore")[0]}
                    <TextLink onPress={() => console.log("press")} text={i18n.t("privacy.readMore")[1]} />
                    {i18n.t("privacy.readMore")[2]}
                </Text>

                <View style={styles.actionsWrapper}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => this.decline()}>
                        <Text style={styles.actionButtonTextDecline}>{i18n.t("tos.decline")}</Text>
                        <MaterialIcons name="close" style={styles.actionButtonTextDecline} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => next()}>
                        <Text style={styles.actionButtonTextAccept}>{i18n.t("tos.accept")}</Text>
                        <MaterialIcons name="check" style={styles.actionButtonTextAccept} />
                    </TouchableOpacity>
                </View>

                {this.state.declined && (
                    <TOSDeclinedModal onHide={() => this.setState({...this.state, declined: false})}></TOSDeclinedModal>
                )}
            </OnboardingSlide>
        );
    }
}

export default withTheme(OnboardingPrivacyScreen);