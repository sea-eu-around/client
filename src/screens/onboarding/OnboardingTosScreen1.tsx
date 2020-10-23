import {Formik, FormikProps} from "formik";
import * as React from "react";
import OnboardingSlide from "./OnboardingSlide";
import i18n from "i18n-js";
import * as Yup from "yup";
import themes from "../../constants/themes";
import {AppState, MyThunkDispatch} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {OnboardingProps} from ".";
import {rootNavigate} from "../../navigation/utils";
import {createProfile} from "../../state/profile/actions";
import {CreateProfileDto, CreateProfileDtoCommon} from "../../api/dto";
import {LEVELS_OF_STUDY} from "../../constants/profile-constants";

const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
    onboardingState: state.auth.onboarding,
}));

const VALIDATION_SCHEMA = Yup.object().shape({
    //languages: VALIDATOR_ONBOARDING_LANGUAGES,
});

type OnboardingTosScreen1Props = ConnectedProps<typeof reduxConnector> & OnboardingProps;

type OnboardingTos1FormState = {
    //checked: boolean;
};

/*

export type OnboardingState = {
    firstname: string;
    lastname: string;
    birthDate: Date | null;
    gender: Gender | null;
    nationality: CountryCode | null;
    role: Role | null;
    levelOfStudy: number;
    staffRole: StaffRole | null;
    languages: SpokenLanguage[];
};

export type CreateProfileDto = {
    firstName: string;
    lastName: string;
    university: string;
    gender: Gender;
    birthdate: string;
    degree: string;
    nationality: CountryCode;
    languages: SpokenLanguage[];
};


*/

class OnboardingTosScreen1 extends React.Component<OnboardingTosScreen1Props> {
    submit(values: OnboardingTos1FormState) {
        //this.props.dispatch(setOnboardingValues({languages: values.languages}));

        const onboarding = this.props.onboardingState;
        if (onboarding.role && onboarding.gender && onboarding.birthDate && onboarding.nationality) {
            const commonProfileDto: CreateProfileDtoCommon = {
                firstName: onboarding.firstname,
                lastName: onboarding.lastname,
                gender: onboarding.gender,
                birthdate: onboarding.birthDate.toJSON(),
                nationality: onboarding.nationality,
                languages: onboarding.languages,
            };

            let profileDto: CreateProfileDto | null = null;

            if (onboarding.role == "student" && onboarding.levelOfStudy) {
                profileDto = {
                    ...commonProfileDto,
                    degree: LEVELS_OF_STUDY[onboarding.levelOfStudy],
                };
            } else if (onboarding.role == "staff" && onboarding.staffRole) {
                profileDto = {
                    ...commonProfileDto,
                    staffRole: onboarding.staffRole,
                };
            }

            if (profileDto) (this.props.dispatch as MyThunkDispatch)(createProfile(onboarding.role, profileDto));
        }
    }

    render(): JSX.Element {
        const {onboardingState} = this.props;

        return (
            <Formik
                initialValues={onboardingState as OnboardingTos1FormState}
                validationSchema={VALIDATION_SCHEMA}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={(values: OnboardingTos1FormState) => this.submit(values)}
            >
                {(formikProps: FormikProps<OnboardingTos1FormState>) => {
                    const {handleSubmit, values, errors, touched, setFieldValue} = formikProps;

                    return (
                        <OnboardingSlide
                            title={i18n.t("onboarding.tos1.title")}
                            subtitle={i18n.t("onboarding.tos1.subtitle")}
                            handleSubmit={handleSubmit}
                            {...this.props}
                        ></OnboardingSlide>
                    );
                }}
            </Formik>
        );
    }
}

export default reduxConnector(OnboardingTosScreen1);
