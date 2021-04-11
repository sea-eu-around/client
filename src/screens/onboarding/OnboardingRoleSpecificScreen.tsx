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
import {TouchableOpacity, Text, StyleSheet, Switch, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {VALIDATOR_ONBOARDING_DEGREE} from "../../validators";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {styleTextThin} from "../../styles/general";
import {getLocalSvg} from "../../assets";
import layout from "../../constants/layout";
import {useState} from "react";

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
                            illustration={<StudentIllustration />}
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
                illustration={<StaffIllustration />}
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

function StudentIllustration(): JSX.Element {
    const wide = layout.isWideDevice;
    const svgHeight = wide ? 500 : 275;

    const [value, setValue] = useState(0);
    const forceUpdate = () => setValue(value + 1);

    const Svg = getLocalSvg("woman-holding-phone-4", () => forceUpdate());
    const Blob = getLocalSvg("blob-10", () => forceUpdate());

    return (
        <View style={[{height: svgHeight}, !wide && {marginLeft: svgHeight * 0.4}]}>
            <Blob width={svgHeight * (405 / 365)} height={svgHeight} viewBox="0 0 405 365" />
            <Svg
                style={{
                    position: "absolute",
                    ...(wide
                        ? {left: svgHeight * 0.25, top: svgHeight * 0.1}
                        : {right: -svgHeight * 0.22, top: svgHeight * 0.12}),
                }}
                width={svgHeight * 0.85 * (225 / 320)}
                height={svgHeight * 0.85}
                viewBox="0 0 225 320"
            />
        </View>
    );
}

function StaffIllustration(): JSX.Element {
    const wide = layout.isWideDevice;
    const svgHeight = wide ? 500 : 300;

    const [value, setValue] = useState(0);
    const forceUpdate = () => setValue(value + 1);

    const Svg = getLocalSvg("woman-holding-phone-4", () => forceUpdate());
    const Blob = getLocalSvg("blob-11", () => forceUpdate());

    return (
        <View
            style={[
                {height: svgHeight, zIndex: -1},
                !wide && {
                    position: "absolute",
                    top: -120,
                    right: -150,
                },
            ]}
        >
            <Blob width={svgHeight * (415 / 450)} height={svgHeight} viewBox="0 0 415 450" />
            <Svg
                style={{
                    position: "absolute",
                    ...(wide
                        ? {left: svgHeight * 0.11, top: svgHeight * 0.1}
                        : {left: svgHeight * 0.12, top: svgHeight * 0.06}),
                }}
                width={svgHeight * 0.8 * (225 / 320)}
                height={svgHeight * 0.8}
                viewBox="0 0 225 320"
            />
        </View>
    );
}

export default reduxConnector(withTheme(OnboardingRoleSpecificScreen));
