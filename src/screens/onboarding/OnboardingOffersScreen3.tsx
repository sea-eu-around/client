import * as React from "react";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import i18n from "i18n-js";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {createOfferControls, finishOnboarding} from "./helpers";
import {OfferCategory} from "../../api/dto";

// State-linked props
const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
    offers: state.profile.offers,
}));

// Component props
type OnboardingOfferScreen3Props = ConnectedProps<typeof reduxConnector> & OnboardingScreenProps;

class OnboardingOfferScreen3 extends React.Component<OnboardingOfferScreen3Props> {
    render(): JSX.Element {
        const {onboardingState, offers, dispatch} = this.props;

        return (
            <OnboardingSlide
                title={i18n.t("onboarding.offers3.title")}
                subtitle={i18n.t("onboarding.offers3.subtitle")}
                handleSubmit={() => finishOnboarding(onboardingState)}
                {...this.props}
            >
                {createOfferControls(offers, OfferCategory.Collaborate, onboardingState, dispatch)}
            </OnboardingSlide>
        );
    }
}

export default reduxConnector(OnboardingOfferScreen3);
