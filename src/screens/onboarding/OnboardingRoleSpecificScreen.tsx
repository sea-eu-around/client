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
import {Degree, StaffRole, STAFF_ROLES, STAFF_ROLE_ICONS} from "../../constants/profile-constants";
import DegreeToggle from "../../components/DegreeToggle";
import {TouchableOpacity, Text, StyleSheet, Switch} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {VALIDATOR_ONBOARDING_DEGREE} from "../../validators";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {styleTextThin} from "../../styles/general";

const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
}));

const VALIDATION_SCHEMA = Yup.object().shape({
    degree: VALIDATOR_ONBOARDING_DEGREE,
});

type OnboardingRoleSpecificScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps & OnboardingScreenProps;

type OnboardingRoleSpecificScreenFormState = {
    degree: Degree;
};

class OnboardingRoleSpecificScreen extends React.Component<OnboardingRoleSpecificScreenProps> {
    submit(values: Partial<OnboardingRoleSpecificScreenFormState>) {
        this.props.dispatch(setOnboardingValues(values));
        this.props.next();
    }

    studentRender(): JSX.Element {
        const {onboardingState, theme} = this.props;
        const styles = studentThemedStyles(theme);

        return (
            <Formik
                initialValues={onboardingState as OnboardingRoleSpecificScreenFormState}
                validationSchema={VALIDATION_SCHEMA}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={(values: OnboardingRoleSpecificScreenFormState) => this.submit(values)}
            >
                {(formikProps: FormikProps<OnboardingRoleSpecificScreenFormState>) => {
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
                                styleVariant="onboarding"
                            />
                            {touched.degree && <InputErrorText error={errors.degree}></InputErrorText>}
                        </OnboardingSlide>
                    );
                }}
            </Formik>
        );
    }

    staffRender(): JSX.Element {
        const {theme, onboardingState, dispatch} = this.props;
        const styles = staffThemedStyles(theme);
        const staffRoles = onboardingState.staffRoles;
        const atLeastOne = Object.values(staffRoles).some((v) => v === true);

        const setValue = (sr: StaffRole, b: boolean) =>
            dispatch(setOnboardingValues({staffRoles: {...staffRoles, [sr]: b}}));

        const buttons = STAFF_ROLES.map((sr: StaffRole, i: number) => (
            <TouchableOpacity
                key={i}
                style={styles.button}
                activeOpacity={0.6}
                onPress={() => setValue(sr, !staffRoles[sr])}
            >
                <MaterialIcons name={STAFF_ROLE_ICONS[i]} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>{i18n.t(`staffRoles.${sr}`)}</Text>
                <Switch
                    value={staffRoles[sr]}
                    thumbColor={theme.accent}
                    trackColor={{true: theme.accentTernary, false: theme.accentSlight}}
                    onValueChange={(b: boolean) => setValue(sr, b)}
                />
            </TouchableOpacity>
        ));

        return (
            <OnboardingSlide
                title={i18n.t("onboarding.roleSpecific1.staff.title")}
                hideNavNext={!atLeastOne}
                {...this.props}
            >
                {buttons}
            </OnboardingSlide>
        );
    }

    render(): JSX.Element {
        const {onboardingState} = this.props;
        return (
            <>
                {onboardingState.type === "student" && this.studentRender()}
                {onboardingState.type === "staff" && this.staffRender()}
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
            ...styleTextThin,
            fontSize: 25,
            letterSpacing: 1.25,
            color: theme.text,
            flexGrow: 1,
        },
        buttonIcon: {
            fontSize: 30,
            marginRight: 10,
            color: theme.accent,
        },
    });
});

export default reduxConnector(withTheme(OnboardingRoleSpecificScreen));
