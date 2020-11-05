import * as React from "react";
import OnboardingSlide from "./OnboardingSlide";
import i18n from "i18n-js";
import themes from "../../constants/themes";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {OnboardingProps} from ".";
import {OfferDto} from "../../api/dto";
import {createOfferControls} from "./helpers";

// State-linked props
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
    onboardingState: state.auth.onboarding,
    offers: state.profile.offers,
}));

// Component props
type OnboardingOfferScreen1Props = ConnectedProps<typeof reduxConnector> & OnboardingProps;

class OnboardingOfferScreen1 extends React.Component<OnboardingOfferScreen1Props> {
    render(): JSX.Element {
        const {onboardingState, offers, dispatch} = this.props;

        const tempOffers: OfferDto[] = [
            {
                id: "drink-a-beer",
                category: "meet",
                allowChooseGender: true,
                allowChooseRole: true,
                allowInterRole: true,
            },
            {
                id: "visit-campus",
                category: "meet",
                allowChooseGender: true,
                allowChooseRole: true,
                allowInterRole: true,
            },
            {
                id: "provide-couch",
                category: "meet",
                allowChooseGender: true,
                allowChooseRole: false,
                allowInterRole: false,
            },
        ];

        return (
            <OnboardingSlide
                title={i18n.t("onboarding.offers1.title")}
                subtitle={i18n.t("onboarding.offers1.subtitle")}
                {...this.props}
            >
                {createOfferControls(tempOffers, "meet", onboardingState, dispatch)}
            </OnboardingSlide>
        );
    }
}

export default reduxConnector(OnboardingOfferScreen1);
