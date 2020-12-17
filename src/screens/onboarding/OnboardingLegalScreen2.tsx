import * as React from "react";
import {OnboardingScreenProps} from "./OnboardingSlide";
import i18n from "i18n-js";
import OnboardingLegalSlide from "./OnboardingLegalSlide";

class OnboardingLegalScreen1 extends React.Component<OnboardingScreenProps> {
    render(): JSX.Element {
        return (
            <OnboardingLegalSlide
                title={i18n.t("onboarding.legal2.title")}
                text={i18n.t("onboarding.legal2.text")}
                {...this.props}
            />
        );
    }
}

export default OnboardingLegalScreen1;
