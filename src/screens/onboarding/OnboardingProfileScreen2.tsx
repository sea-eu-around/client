import {Formik, FormikProps} from "formik";
import * as React from "react";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import i18n from "i18n-js";
import * as Yup from "yup";
import {VALIDATOR_ONBOARDING_INTERESTS, VALIDATOR_ONBOARDING_LANGUAGES} from "../../validators";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {setOnboardingValues} from "../../state/auth/actions";
import InputLabel from "../../components/InputLabel";
import InputErrorText from "../../components/InputErrorText";
import SpokenLanguagesInput from "../../components/SpokenLanguagesInput";
import {SpokenLanguageDto} from "../../api/dto";
import InterestsPicker from "../../components/InterestsPicker";

const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
}));

const VALIDATION_SCHEMA = Yup.object().shape({
    languages: VALIDATOR_ONBOARDING_LANGUAGES,
    interestIds: VALIDATOR_ONBOARDING_INTERESTS,
});

type OnboardingProfileScreen2Props = ConnectedProps<typeof reduxConnector> & OnboardingScreenProps;

type OnboardingProfileScreen2State = {
    hasErrors: boolean;
};

type OnboardingProfile2FormState = {
    languages: SpokenLanguageDto[];
    interestIds: string[];
};

class OnboardingProfileScreen2 extends React.Component<OnboardingProfileScreen2Props, OnboardingProfileScreen2State> {
    constructor(props: OnboardingProfileScreen2Props) {
        super(props);
        this.state = {hasErrors: false};
    }

    submit(values: OnboardingProfile2FormState) {
        if (!this.state.hasErrors) {
            this.props.dispatch(setOnboardingValues({languages: values.languages, interestIds: values.interestIds}));
            this.props.next();
        }
    }

    render(): JSX.Element {
        const {onboardingState} = this.props;
        const {hasErrors} = this.state;

        const spacing = 30;

        return (
            <Formik
                initialValues={onboardingState as OnboardingProfile2FormState}
                validationSchema={VALIDATION_SCHEMA}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={(values: OnboardingProfile2FormState) => this.submit(values)}
            >
                {(formikProps: FormikProps<OnboardingProfile2FormState>) => {
                    const {handleSubmit, values, touched, setFieldValue, errors} = formikProps;

                    return (
                        <OnboardingSlide
                            title={i18n.t("onboarding.profile2.title")}
                            handleSubmit={handleSubmit}
                            {...this.props}
                        >
                            <InputLabel>{i18n.t("spokenLanguages")}</InputLabel>
                            <SpokenLanguagesInput
                                languages={values.languages}
                                onChange={(languages: SpokenLanguageDto[], hasErrors: boolean) => {
                                    setFieldValue("languages", languages);
                                    this.setState({...this.state, hasErrors});
                                }}
                                pickerButtonStyleVariant="onboarding"
                            />
                            {touched.languages && hasErrors && (
                                <InputErrorText
                                    error={"validation.language.specifyLevel"}
                                    style={{marginBottom: 0, marginTop: 10}}
                                />
                            )}
                            {touched.languages && !hasErrors && values.languages.length == 0 && (
                                <InputErrorText
                                    error={"validation.language.atLeastOne"}
                                    style={{marginBottom: 0, marginTop: 10}}
                                />
                            )}

                            <InputLabel style={{marginTop: spacing}}>{i18n.t("chooseInterests")}</InputLabel>
                            <InterestsPicker
                                interests={values.interestIds}
                                onChange={(interestIds: string[]) => {
                                    setFieldValue("interestIds", interestIds);
                                }}
                                showChips={true}
                                buttonStyleVariant="onboarding"
                            />
                            {touched.interestIds && <InputErrorText error={errors.interestIds} />}
                        </OnboardingSlide>
                    );
                }}
            </Formik>
        );
    }
}

export default reduxConnector(OnboardingProfileScreen2);
