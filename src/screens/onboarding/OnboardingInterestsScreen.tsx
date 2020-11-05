import {Formik, FormikProps} from "formik";
import * as React from "react";
import OnboardingSlide from "./OnboardingSlide";
import i18n from "i18n-js";
import * as Yup from "yup";
import {VALIDATOR_ONBOARDING_LANGUAGES} from "../../validators";
import themes from "../../constants/themes";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {setOnboardingValues} from "../../state/auth/actions";
import {OnboardingProps} from ".";
import InputLabel from "../../components/InputLabel";
import InputErrorText from "../../components/InputErrorText";
import SpokenLanguagesInput from "../../components/SpokenLanguagesInput";
import {SpokenLanguage} from "../../model/spoken-language";
import {InterestDto} from "../../api/dto";
import InterestsPicker from "../../components/InterestsPicker";

const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
    onboardingState: state.auth.onboarding,
}));

const VALIDATION_SCHEMA = Yup.object().shape({
    languages: VALIDATOR_ONBOARDING_LANGUAGES,
});

type OnboardingInterestsScreenProps = ConnectedProps<typeof reduxConnector> & OnboardingProps;

type OnboardingInterestsScreenState = {
    hasErrors: boolean;
};

type OnboardingInterestsFormState = {
    interestIds: string[];
};

class OnboardingInterestsScreen extends React.Component<
    OnboardingInterestsScreenProps,
    OnboardingInterestsScreenState
> {
    constructor(props: OnboardingInterestsScreenProps) {
        super(props);
        this.state = {hasErrors: false};
    }

    submit(values: OnboardingInterestsFormState) {
        if (!this.state.hasErrors) {
            this.props.dispatch(setOnboardingValues({interestIds: values.interestIds}));
            this.props.next();
        }
    }

    render(): JSX.Element {
        const {onboardingState} = this.props;

        return (
            <Formik
                initialValues={onboardingState as OnboardingInterestsFormState}
                validationSchema={VALIDATION_SCHEMA}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={(values: OnboardingInterestsFormState) => this.submit(values)}
            >
                {(formikProps: FormikProps<OnboardingInterestsFormState>) => {
                    const {handleSubmit, values, errors, touched, setFieldValue} = formikProps;

                    return (
                        <OnboardingSlide
                            title={i18n.t("onboarding.interests.title")}
                            handleSubmit={handleSubmit}
                            {...this.props}
                        >
                            <InputLabel style={{marginBottom: 6}}>{i18n.t("chooseInterests")}</InputLabel>
                            <InterestsPicker
                                interests={values.interestIds}
                                onChange={(interestIds: string[], hasErrors: boolean) => {
                                    setFieldValue("interestIds", interestIds);
                                    this.setState({...this.state, hasErrors});
                                }}
                            ></InterestsPicker>
                            {touched.interestIds && <InputErrorText error={errors.interestIds}></InputErrorText>}
                        </OnboardingSlide>
                    );
                }}
            </Formik>
        );
    }
}

export default reduxConnector(OnboardingInterestsScreen);
