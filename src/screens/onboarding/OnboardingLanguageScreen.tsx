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

const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
    onboardingState: state.auth.onboarding,
}));

const VALIDATION_SCHEMA = Yup.object().shape({
    languages: VALIDATOR_ONBOARDING_LANGUAGES,
});

type OnboardingLanguageScreenProps = ConnectedProps<typeof reduxConnector> & OnboardingProps;

type OnboardingLanguageScreenState = {
    hasErrors: boolean;
};

type OnboardingLanguageFormState = {
    languages: SpokenLanguage[];
};

class OnboardingLanguageScreen extends React.Component<OnboardingLanguageScreenProps, OnboardingLanguageScreenState> {
    constructor(props: OnboardingLanguageScreenProps) {
        super(props);
        this.state = {hasErrors: false};
    }

    submit(values: OnboardingLanguageFormState) {
        if (!this.state.hasErrors) {
            this.props.dispatch(setOnboardingValues({languages: values.languages}));
            this.props.next();
        }
    }

    render(): JSX.Element {
        const {onboardingState} = this.props;

        return (
            <Formik
                initialValues={onboardingState as OnboardingLanguageFormState}
                validationSchema={VALIDATION_SCHEMA}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={(values: OnboardingLanguageFormState) => this.submit(values)}
            >
                {(formikProps: FormikProps<OnboardingLanguageFormState>) => {
                    const {handleSubmit, values, errors, touched, setFieldValue} = formikProps;

                    return (
                        <OnboardingSlide
                            title={i18n.t("onboarding.language.title")}
                            handleSubmit={handleSubmit}
                            {...this.props}
                        >
                            <InputLabel style={{marginBottom: 6}}>{i18n.t("spokenLanguages")}</InputLabel>
                            <SpokenLanguagesInput
                                languages={values.languages}
                                onChange={(languages: SpokenLanguage[], hasErrors: boolean) => {
                                    setFieldValue("languages", languages);
                                    this.setState({...this.state, hasErrors});
                                }}
                            ></SpokenLanguagesInput>
                            {touched.languages && <InputErrorText error={errors.languages}></InputErrorText>}
                        </OnboardingSlide>
                    );
                }}
            </Formik>
        );
    }
}

export default reduxConnector(OnboardingLanguageScreen);
