import {Formik, FormikProps} from "formik";
import * as React from "react";
import OnboardingSlide from "./OnboardingSlide";
import i18n from "i18n-js";
import * as Yup from "yup";
import {VALIDATOR_ONBOARDING_LEVEL_OF_STUDY} from "../../validators";
import themes from "../../constants/themes";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {setOnboardingValues} from "../../state/auth/actions";
import {OnboardingProps} from ".";
import InputLabel from "../../components/InputLabel";
import InputErrorText from "../../components/InputErrorText";
import {StaffRole, STAFF_ROLES} from "../../constants/profile-constants";
import {LevelOfStudyControl} from "../../components/LevelOfStudyControl";
import {EducationFieldSelect} from "../../components/EducationFieldSelect";
import {View, TouchableOpacity, Text, StyleSheet} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";

const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
    onboardingState: state.auth.onboarding,
}));

const VALIDATION_SCHEMA = Yup.object().shape({
    levelOfStudy: VALIDATOR_ONBOARDING_LEVEL_OF_STUDY,
});

type OnboardingRoleSpecificScreen1Props = ConnectedProps<typeof reduxConnector> & OnboardingProps;

type OnboardingRoleSpecificScreen1FormState = {
    levelOfStudy: number;
    staffRole: StaffRole | null;
};

class OnboardingRoleSpecificScreen1 extends React.Component<OnboardingRoleSpecificScreen1Props> {
    submit(values: Partial<OnboardingRoleSpecificScreen1FormState>) {
        this.props.dispatch(setOnboardingValues(values));
        this.props.next();
    }

    studentRender(): JSX.Element {
        const {onboardingState} = this.props;
        const spacing = 30;

        return (
            <Formik
                initialValues={onboardingState as OnboardingRoleSpecificScreen1FormState}
                validationSchema={VALIDATION_SCHEMA}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={(values: OnboardingRoleSpecificScreen1FormState) => this.submit(values)}
            >
                {(formikProps: FormikProps<OnboardingRoleSpecificScreen1FormState>) => {
                    const {handleSubmit, values, errors, touched, setFieldValue} = formikProps;

                    return (
                        <OnboardingSlide
                            title={i18n.t(`onboarding.roleSpecific1.student.title`)}
                            handleSubmit={handleSubmit}
                            {...this.props}
                        >
                            <InputLabel style={{marginTop: spacing}}>{i18n.t("levelOfStudy")}</InputLabel>
                            <LevelOfStudyControl
                                levelIndex={values.levelOfStudy}
                                onUpdateIndex={(i: number) => setFieldValue("levelOfStudy", i)}
                            />
                            {touched.levelOfStudy && <InputErrorText error={errors.levelOfStudy}></InputErrorText>}

                            <InputLabel style={{marginTop: spacing}}>{i18n.t("fieldsOfEducation")}</InputLabel>
                            <EducationFieldSelect></EducationFieldSelect>
                        </OnboardingSlide>
                    );
                }}
            </Formik>
        );
    }

    staffRender(): JSX.Element {
        const {theme} = this.props;
        const styles = StyleSheet.create({
            button: {
                height: 60,
                flexDirection: "row",
                alignItems: "center",
            },
            buttonText: {
                fontFamily: "sans-serif-thin",
                fontSize: 25,
                letterSpacing: 1.25,
            },
            buttonIcon: {
                fontSize: 30,
                marginRight: 10,
            },
        });

        const icons = ["school", "library-books", "help", "account-balance", "build", "verified-user"];

        const buttons = STAFF_ROLES.map((sr: string, i: number) => (
            <TouchableOpacity key={i} style={styles.button} onPress={() => this.submit({staffRole: sr as StaffRole})}>
                <MaterialIcons name={icons[i]} style={[styles.buttonIcon, {color: theme.accent}]}></MaterialIcons>
                <Text style={[styles.buttonText, {color: theme.text}]}>{i18n.t(`staffRoles.${sr}`)}</Text>
            </TouchableOpacity>
        ));

        return (
            <OnboardingSlide title={i18n.t("onboarding.roleSpecific1.staff.title")} hideNavNext={true} {...this.props}>
                {buttons}
            </OnboardingSlide>
        );
    }
    /*

        <InputLabel style={{marginTop: spacing}}>{i18n.t("staffPosition")}</InputLabel>
        <StaffRoleToggle
            staffRole={values.staffRole}
            onSelect={(staffRole: StaffRole) => setFieldValue("staffRole", staffRole)}
        />
        {touched.staffRole && <InputErrorText error={errors.staffRole}></InputErrorText>}
    */

    render(): JSX.Element {
        const {onboardingState} = this.props;
        const isStudent = onboardingState.role == "student";

        return (
            <>
                {isStudent && this.studentRender()}
                {!isStudent && this.staffRender()}
            </>
        );
    }
}

export default reduxConnector(OnboardingRoleSpecificScreen1);
