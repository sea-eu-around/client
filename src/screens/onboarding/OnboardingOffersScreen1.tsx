import * as React from "react";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import i18n from "i18n-js";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {createOfferControls} from "./helpers";
import {OfferCategory} from "../../api/dto";
import FormattedOfferCategory from "../../components/FormattedOfferCategory";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {onboardingOffersStyle} from "../../styles/onboarding";

// State-linked props
const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
    offers: state.profile.offers,
}));

// Component props
type OnboardingOfferScreen1Props = ConnectedProps<typeof reduxConnector> & OnboardingScreenProps & ThemeProps;

class OnboardingOfferScreen1 extends React.Component<OnboardingOfferScreen1Props> {
    shouldComponentUpdate(nextProps: Readonly<OnboardingOfferScreen1Props>) {
        const prev = this.props.onboardingState;
        const next = nextProps.onboardingState;
        return prev.offerValues != next.offerValues;
    }

    render(): JSX.Element {
        const {onboardingState, offers, dispatch, theme} = this.props;
        const styles = onboardingOffersStyle(theme);
        const category = OfferCategory.Discover;

        return (
            <OnboardingSlide
                title={<FormattedOfferCategory category={category} textStyle={styles.categoryTitleText} />}
                subtitle={i18n.t("onboarding.offersDiscover.subtitle")}
                {...this.props}
            >
                {createOfferControls(offers, category, onboardingState, dispatch)}
            </OnboardingSlide>
        );
    }
}

export default reduxConnector(withTheme(OnboardingOfferScreen1));
