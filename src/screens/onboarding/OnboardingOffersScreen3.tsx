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
type OnboardingOfferScreen3Props = ConnectedProps<typeof reduxConnector> & OnboardingScreenProps;

class OnboardingOfferScreen3 extends React.Component<OnboardingOfferScreen3Props> {
    shouldComponentUpdate(nextProps: Readonly<OnboardingOfferScreen3Props>) {
        const prev = this.props.onboardingState;
        const next = nextProps.onboardingState;
        return prev.offerValues != next.offerValues;
    }

    render(): JSX.Element {
        const {onboardingState, offers, dispatch} = this.props;

        return (
            <OnboardingSlide
                title={i18n.t("onboarding.offersMeet.title")}
                subtitle={i18n.t("onboarding.offersMeet.subtitle")}
                {...this.props}
            >
                {createOfferControls(offers, OfferCategory.Meet, onboardingState, dispatch)}
            </OnboardingSlide>
        );
    }
}

export default reduxConnector(OnboardingOfferScreen3);
