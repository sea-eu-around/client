import {Formik, FormikProps} from "formik";
import * as React from "react";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import i18n from "i18n-js";
import * as Yup from "yup";
import {VALIDATOR_ONBOARDING_INTERESTS} from "../../validators";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {setOnboardingValues} from "../../state/auth/actions";
import InputLabel from "../../components/InputLabel";
import InputErrorText from "../../components/InputErrorText";
import InterestsPicker from "../../components/InterestsPicker";

const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
}));

type OnboardingInterestsScreenProps = ConnectedProps<typeof reduxConnector> & OnboardingScreenProps;

const VALIDATION_SCHEMA = Yup.object().shape({
    interestIds: VALIDATOR_ONBOARDING_INTERESTS,
});

type OnboardingInterestsFormState = {
    interestIds: string[];
};

class OnboardingInterestsScreen extends React.Component<OnboardingInterestsScreenProps> {
    shouldComponentUpdate(nextProps: Readonly<OnboardingInterestsScreenProps>) {
        const prev = this.props.onboardingState;
        const next = nextProps.onboardingState;
        return prev.interestIds != next.interestIds;
    }

    submit(values: OnboardingInterestsFormState) {
        this.props.dispatch(setOnboardingValues({interestIds: values.interestIds}));
        this.props.next();
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
                                onChange={(interestIds: string[]) => {
                                    setFieldValue("interestIds", interestIds);
                                }}
                                showChips={true}
                            />
                            {touched.interestIds && <InputErrorText error={errors.interestIds} />}
                        </OnboardingSlide>
                    );
                }}
            </Formik>
        );
    }
}

export default reduxConnector(OnboardingInterestsScreen);
