// TODO get rid of this
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from "react";
import OnboardingSlide from "./OnboardingSlide";
import i18n from "i18n-js";
import themes from "../../constants/themes";
import {AppState, MyThunkDispatch} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {OnboardingProps} from ".";
import {createOfferControls, onboardingStateToDto} from "./helpers";
import {createProfile} from "../../state/profile/actions";
import {rootNavigate} from "../../navigation/utils";

// State-linked props
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
    onboardingState: state.auth.onboarding,
    offers: state.profile.offers,
}));

// Component props
type OnboardingOfferScreen3Props = ConnectedProps<typeof reduxConnector> & OnboardingProps;

class OnboardingOfferScreen3 extends React.Component<OnboardingOfferScreen3Props> {
    render(): JSX.Element {
        const {onboardingState, offers, dispatch} = this.props;

        return (
            <OnboardingSlide
                title={i18n.t("onboarding.offers3.title")}
                subtitle={i18n.t("onboarding.offers3.subtitle")}
                handleSubmit={() => {
                    /*
                    const createProfileDto = onboardingStateToDto(onboardingState);
                    if (createProfileDto)
                        (dispatch as MyThunkDispatch)(createProfile(onboardingState.role!, createProfileDto));
                    */
                    // TODO temporary redirect to connect
                    rootNavigate("MainScreen");
                }}
                {...this.props}
            >
                {createOfferControls(offers, "collaborate", onboardingState, dispatch)}
            </OnboardingSlide>
        );
    }
}

export default reduxConnector(OnboardingOfferScreen3);
