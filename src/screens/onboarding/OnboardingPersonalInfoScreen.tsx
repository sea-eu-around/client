import {Formik, FormikProps} from "formik";
import * as React from "react";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import i18n from "i18n-js";
import * as Yup from "yup";
import {
    VALIDATOR_ONBOARDING_BIRTHDATE,
    VALIDATOR_ONBOARDING_GENDER,
    VALIDATOR_ONBOARDING_NATIONALITY,
} from "../../validators";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {setOnboardingValues} from "../../state/auth/actions";
import InputLabel from "../../components/InputLabel";
import BirthDateControl from "../../components/BirthDateControl";
import InputErrorText from "../../components/InputErrorText";
import {Gender} from "../../constants/profile-constants";
import {GenderToggle} from "../../components/GenderToggle";
import NationalityControl from "../../components/NationalityControl";
import {CountryCode} from "../../model/country-codes";

const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
}));

const VALIDATION_SCHEMA = Yup.object().shape({
    birthdate: VALIDATOR_ONBOARDING_BIRTHDATE,
    gender: VALIDATOR_ONBOARDING_GENDER,
    nationality: VALIDATOR_ONBOARDING_NATIONALITY,
});

type OnboardingPersonalInfoScreenProps = ConnectedProps<typeof reduxConnector> & OnboardingScreenProps;

type OnboardingPersonalInfoFormState = {
    birthdate: Date | null;
    gender: Gender | null;
    nationality: CountryCode | null;
};

class OnboardingPersonalInfoScreen extends React.Component<OnboardingPersonalInfoScreenProps> {
    submit(values: OnboardingPersonalInfoFormState) {
        if (values.birthdate && values.gender && values.nationality) {
            this.props.dispatch(
                setOnboardingValues({
                    birthdate: values.birthdate,
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
                initialValues={onboardingState as OnboardingPersonalInfoFormState}
                validationSchema={VALIDATION_SCHEMA}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={(values: OnboardingPersonalInfoFormState) => this.submit(values)}
            >
                {(formikProps: FormikProps<OnboardingPersonalInfoFormState>) => {
                    const {handleSubmit, values, errors, touched, setFieldValue} = formikProps;

                    return (
                        <OnboardingSlide
                            title={i18n.t("onboarding.personalInfo.title")}
                            //subtitle={i18n.t("onboarding.personalInfo.subtitle")}
                            handleSubmit={handleSubmit}
                            {...this.props}
                        >
                            <InputLabel>{i18n.t("dateOfBirth")}</InputLabel>
                            <BirthDateControl
                                date={values.birthdate || undefined}
                                onSelect={(birthdate: Date) => setFieldValue("birthdate", birthdate)}
                            />
                            {touched.birthdate && <InputErrorText error={errors.birthdate}></InputErrorText>}

                            <InputLabel style={{marginTop: spacing}}>{i18n.t("nationality")}</InputLabel>
                            <NationalityControl
                                nationality={values.nationality || undefined}
                                onSelect={(nationality: CountryCode) => setFieldValue("nationality", nationality)}
                            />
                            {touched.nationality && <InputErrorText error={errors.nationality}></InputErrorText>}

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

export default reduxConnector(OnboardingPersonalInfoScreen);
