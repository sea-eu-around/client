import {Formik, FormikProps} from "formik";
import * as React from "react";
import OnboardingSlide from "./OnboardingSlide";
import i18n from "i18n-js";
import * as Yup from "yup";
import {
    VALIDATOR_ONBOARDING_BIRTHDATE,
    VALIDATOR_ONBOARDING_GENDER,
    VALIDATOR_ONBOARDING_NATIONALITY,
} from "../../validators";
import themes from "../../constants/themes";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {setOnboardingValues} from "../../state/auth/actions";
import {OnboardingProps} from ".";
import InputLabel from "../../components/InputLabel";
import InputErrorText from "../../components/InputErrorText";
import {Gender} from "../../constants/profile-constants";
import {GenderToggle} from "../../components/GenderToggle";
import {CountryCode} from "../../model/country-codes";

const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
    onboardingState: state.auth.onboarding,
}));

const VALIDATION_SCHEMA = Yup.object().shape({
    birthDate: VALIDATOR_ONBOARDING_BIRTHDATE,
    gender: VALIDATOR_ONBOARDING_GENDER,
    nationality: VALIDATOR_ONBOARDING_NATIONALITY,
});

type OnboardingRoleSpecificScreen2Props = ConnectedProps<typeof reduxConnector> & OnboardingProps;

type OnboardingRoleSpecificScreen2FormState = {
    birthDate: Date | null;
    gender: Gender | null;
    nationality: CountryCode | null;
};

class OnboardingRoleSpecificScreen2 extends React.Component<OnboardingRoleSpecificScreen2Props> {
    submit(values: OnboardingRoleSpecificScreen2FormState) {
        if (values.birthDate && values.gender && values.nationality) {
            this.props.dispatch(
                setOnboardingValues({
                    birthDate: values.birthDate,
                    gender: values.gender,
                    nationality: values.nationality,
                }),
            );
            this.props.next();
        }
    }

    render(): JSX.Element {
        const {onboardingState} = this.props;

        const spacing = 30;

        return (
            <Formik
                initialValues={onboardingState as OnboardingRoleSpecificScreen2FormState}
                validationSchema={VALIDATION_SCHEMA}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={(values: OnboardingRoleSpecificScreen2FormState) => this.submit(values)}
            >
                {(formikProps: FormikProps<OnboardingRoleSpecificScreen2FormState>) => {
                    const {handleSubmit, values, errors, touched, setFieldValue} = formikProps;

                    return (
                        <OnboardingSlide
                            title={i18n.t("onboarding.collaborate.title")}
                            subtitle={i18n.t("onboarding.collaborate.subtitle")}
                            handleSubmit={handleSubmit}
                            {...this.props}
                        >
                            <InputLabel style={{marginTop: spacing}}>{i18n.t("gender")}</InputLabel>
                            <GenderToggle
                                gender={values.gender}
                                onSelect={(gender: Gender) => setFieldValue("gender", gender)}
                            />
                            {touched.gender && <InputErrorText error={errors.gender}></InputErrorText>}
                        </OnboardingSlide>
                    );
                }}
            </Formik>
        );
    }
}

export default reduxConnector(OnboardingRoleSpecificScreen2);
