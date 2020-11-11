import * as React from "react";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import i18n from "i18n-js";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {createOfferControls} from "./helpers";
import {OfferCategory} from "../../api/dto";

// State-linked props
const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
    offers: state.profile.offers,
}));

// Component props
type OnboardingOfferScreen2Props = ConnectedProps<typeof reduxConnector> & OnboardingScreenProps;

class OnboardingOfferScreen2 extends React.Component<OnboardingOfferScreen2Props> {
    render(): JSX.Element {
        const {onboardingState, offers, dispatch} = this.props;

        return (
            <OnboardingSlide
                title={i18n.t("onboarding.offers2.title")}
                subtitle={i18n.t("onboarding.offers2.subtitle")}
                {...this.props}
            >
                {createOfferControls(offers, OfferCategory.Discover, onboardingState, dispatch)}
            </OnboardingSlide>
        );
    }
}

export default reduxConnector(OnboardingOfferScreen2);
