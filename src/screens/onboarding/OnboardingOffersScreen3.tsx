import * as React from "react";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import i18n from "i18n-js";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {createOfferControls} from "./helpers";
import {OfferCategory} from "../../api/dto";
import {onboardingOffersStyle} from "../../styles/onboarding";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";
import FormattedOfferCategory from "../../components/FormattedOfferCategory";

// State-linked props
const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
    offers: state.profile.offers,
}));

// Component props
type OnboardingOfferScreen3Props = ConnectedProps<typeof reduxConnector> & OnboardingScreenProps & ThemeProps;

class OnboardingOfferScreen3 extends React.Component<OnboardingOfferScreen3Props> {
    shouldComponentUpdate(nextProps: Readonly<OnboardingOfferScreen3Props>) {
        const prev = this.props.onboardingState;
        const next = nextProps.onboardingState;
        return prev.offerValues != next.offerValues;
    }

    render(): JSX.Element {
        const {onboardingState, offers, dispatch, theme} = this.props;
        const styles = onboardingOffersStyle(theme);
        const category = OfferCategory.Meet;

        return (
            <OnboardingSlide
                title={
                    <FormattedOfferCategory category={category} textStyle={styles.categoryTitleText} fontSize={24} />
                }
                subtitle={i18n.t("onboarding.offersMeet.subtitle")}
                {...this.props}
            >
                {createOfferControls(offers, category, onboardingState, dispatch, theme)}
            </OnboardingSlide>
        );
    }
}

export default reduxConnector(withTheme(OnboardingOfferScreen3));
