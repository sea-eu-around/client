import {Formik, FormikProps} from "formik";
import * as React from "react";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import i18n from "i18n-js";
import * as Yup from "yup";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {setOnboardingValues} from "../../state/auth/actions";
import InputLabel from "../../components/InputLabel";
import InputErrorText from "../../components/InputErrorText";
import {Degree, StaffRole, STAFF_ROLES} from "../../constants/profile-constants";
import DegreeToggle from "../../components/DegreeToggle";
import {TouchableOpacity, Text, StyleSheet} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {VALIDATOR_ONBOARDING_DEGREE} from "../../validators";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";

const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
}));

const VALIDATION_SCHEMA = Yup.object().shape({
    degree: VALIDATOR_ONBOARDING_DEGREE,
});

type OnboardingRoleSpecificScreen1Props = ConnectedProps<typeof reduxConnector> & ThemeProps & OnboardingScreenProps;

type OnboardingRoleSpecificScreen1FormState = {
    degree: Degree;
    staffRole: StaffRole | null;
};

class OnboardingRoleSpecificScreen1 extends React.Component<OnboardingRoleSpecificScreen1Props> {
    submit(values: Partial<OnboardingRoleSpecificScreen1FormState>) {
        this.props.dispatch(setOnboardingValues(values));
        this.props.next();
    }

    studentRender(): JSX.Element {
        const {onboardingState, theme} = this.props;
        const styles = studentThemedStyles(theme);

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
                            <InputLabel style={styles.label}>{i18n.t("levelOfStudy")}</InputLabel>
                            <DegreeToggle
                                degree={values.degree}
                                onUpdate={(degree?: Degree) => setFieldValue("degree", degree)}
                            />
                            {touched.degree && <InputErrorText error={errors.degree}></InputErrorText>}
                        </OnboardingSlide>
                    );
                }}
            </Formik>
        );
    }

    staffRender(): JSX.Element {
        const {theme} = this.props;
        const styles = staffThemedStyles(theme);

        const icons = ["school", "library-books", "help", "account-balance", "build", "verified-user"];

        const buttons = STAFF_ROLES.map((sr: string, i: number) => (
            <TouchableOpacity key={i} style={styles.button} onPress={() => this.submit({staffRole: sr as StaffRole})}>
                <MaterialIcons name={icons[i]} style={styles.buttonIcon}></MaterialIcons>
                <Text style={styles.buttonText}>{i18n.t(`staffRoles.${sr}`)}</Text>
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

export const studentThemedStyles = preTheme(() => {
    return StyleSheet.create({
        label: {
            marginTop: 30,
        },
    });
});

export const staffThemedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        button: {
            height: 60,
            flexDirection: "row",
            alignItems: "center",
        },
        buttonText: {
            fontFamily: "sans-serif-thin",
            fontSize: 25,
            letterSpacing: 1.25,
            color: theme.text,
        },
        buttonIcon: {
            fontSize: 30,
            marginRight: 10,
            color: theme.accent,
        },
    });
});

export default reduxConnector(withTheme(OnboardingRoleSpecificScreen1));
