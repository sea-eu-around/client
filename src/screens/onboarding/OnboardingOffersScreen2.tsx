import * as React from "react";
import OnboardingSlide from "./OnboardingSlide";
import i18n from "i18n-js";
import themes from "../../constants/themes";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {OnboardingProps} from ".";
import {createOfferControls} from "./helpers";

// State-linked props
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
    onboardingState: state.auth.onboarding,
    offers: state.profile.offers,
}));

// Component props
type OnboardingOfferScreen2Props = ConnectedProps<typeof reduxConnector> & OnboardingProps;

class OnboardingOfferScreen2 extends React.Component<OnboardingOfferScreen2Props> {
    render(): JSX.Element {
        const {onboardingState, offers, dispatch} = this.props;

        return (
            <OnboardingSlide
                title={i18n.t("onboarding.offers2.title")}
                subtitle={i18n.t("onboarding.offers2.subtitle")}
                {...this.props}
            >
                {createOfferControls(offers, "discover", onboardingState, dispatch)}
            </OnboardingSlide>
        );
    }
}

export default reduxConnector(OnboardingOfferScreen2);
