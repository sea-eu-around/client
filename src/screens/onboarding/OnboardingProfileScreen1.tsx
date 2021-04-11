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
import InputErrorText from "../../components/InputErrorText";
import {Gender} from "../../constants/profile-constants";
import GenderToggle from "../../components/GenderToggle";
import NationalityControl from "../../components/NationalityControl";
import {CountryCode} from "../../model/country-codes";
import EducationFieldPicker from "../../components/EducationFieldPicker";
import {StyleSheet, View} from "react-native";
import {FormattedDate} from "../../components/FormattedDate";
import BirthDateInput from "../../components/BirthDateInput";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {ONBOARDING_INPUT_BORDER_RADIUS} from "../../styles/onboarding";
import {getLocalSvg} from "../../assets";
import layout from "../../constants/layout";
import {useState} from "react";

const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
}));

const VALIDATION_SCHEMA = Yup.object().shape({
    birthdate: VALIDATOR_ONBOARDING_BIRTHDATE,
    gender: VALIDATOR_ONBOARDING_GENDER,
    nationality: VALIDATOR_ONBOARDING_NATIONALITY,
});

type OnboardingProfileScreen1Props = ConnectedProps<typeof reduxConnector> & ThemeProps & OnboardingScreenProps;

type OnboardingProfile1FormState = {
    birthdate: Date | null;
    gender: Gender | null;
    nationality: CountryCode | null;
    educationFields: string[];
};

class OnboardingProfileScreen1 extends React.Component<OnboardingProfileScreen1Props> {
    shouldComponentUpdate(nextProps: Readonly<OnboardingProfileScreen1Props>) {
        const prev = this.props.onboardingState;
        const next = nextProps.onboardingState;
        return (
            prev.birthdate != next.birthdate ||
            prev.gender != next.gender ||
            prev.nationality != next.nationality ||
            prev.educationFields != next.educationFields
        );
    }

    submit(values: OnboardingProfile1FormState) {
        if (values.birthdate && values.gender && values.nationality && values.educationFields) {
            this.props.next();
            this.props.dispatch(
                setOnboardingValues({
                    birthdate: values.birthdate,
                    gender: values.gender,
                    nationality: values.nationality,
                    educationFields: values.educationFields,
                }),
            );
        }
    }

    render(): JSX.Element {
        const {onboardingState, theme} = this.props;

        const spacing = 30;
        const styles = themedStyles(theme);

        return (
            <Formik
                initialValues={onboardingState as OnboardingProfile1FormState}
                validationSchema={VALIDATION_SCHEMA}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={(values: OnboardingProfile1FormState) => this.submit(values)}
            >
                {(formikProps: FormikProps<OnboardingProfile1FormState>) => {
                    const {
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        setFieldError,
                        setFieldTouched,
                    } = formikProps;

                    return (
                        <OnboardingSlide
                            title={i18n.t("onboarding.profile1.title")}
                            illustration={<Illustration />}
                            handleSubmit={handleSubmit}
                            noKeyboardAvoidance={true}
                            {...this.props}
                        >
                            <InputLabel>{i18n.t("dateOfBirth")}</InputLabel>
                            <BirthDateInput
                                inputStyle={styles.dateTextInput}
                                inputStyleFocused={styles.dateTextInputFocused}
                                inputStyleValid={styles.dateTextInputValid}
                                onChange={(date, error) => {
                                    if (error) setFieldError("birthdate", error);
                                    else setFieldValue("birthdate", date);
                                    setFieldTouched("birthdate", true);
                                }}
                            />
                            {values.birthdate && !errors.birthdate && (
                                <FormattedDate style={styles.birthdateText} date={values.birthdate} />
                            )}
                            {touched.birthdate && <InputErrorText error={errors.birthdate}></InputErrorText>}

                            <InputLabel style={{marginTop: spacing}}>{i18n.t("nationality")}</InputLabel>
                            <NationalityControl
                                buttonStyle={styles.nationalityButton}
                                buttonValidStyle={styles.nationalityButtonValid}
                                nationality={values.nationality || undefined}
                                onSelect={(nationality: CountryCode) => setFieldValue("nationality", nationality)}
                            />
                            {touched.nationality && <InputErrorText error={errors.nationality}></InputErrorText>}

                            <InputLabel style={{marginTop: spacing}}>{i18n.t("gender")}</InputLabel>
                            <GenderToggle
                                gender={values.gender}
                                onSelect={(gender: Gender) => setFieldValue("gender", gender)}
                                styleVariant="onboarding"
                            />
                            {touched.gender && <InputErrorText error={errors.gender}></InputErrorText>}

                            <InputLabel style={{marginTop: spacing}}>{i18n.t("fieldsOfEducation")}</InputLabel>
                            <EducationFieldPicker
                                fields={values.educationFields}
                                onChange={(fields: string[]) => setFieldValue("educationFields", fields)}
                                showChips={true}
                                buttonStyleVariant="onboarding"
                            />
                        </OnboardingSlide>
                    );
                }}
            </Formik>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        dateTextInput: {
            height: 48,
            borderRadius: ONBOARDING_INPUT_BORDER_RADIUS,
            paddingHorizontal: 10,
            borderWidth: 0,
            backgroundColor: theme.onboardingInputBackground,
            fontSize: 16,
            color: theme.text,
        },
        dateTextInputFocused: {
            backgroundColor: theme.accentSlight,
        },
        dateTextInputValid: {
            borderBottomWidth: 1,
            borderBottomColor: theme.okay,
        },
        birthdateText: {
            textAlign: "right",
            marginTop: 4,
            fontSize: 12,
        },
        nationalityButton: {
            height: 48,
            borderRadius: ONBOARDING_INPUT_BORDER_RADIUS,
            backgroundColor: theme.onboardingInputBackground,
            paddingHorizontal: 10,
            borderBottomWidth: 0,
        },
        nationalityButtonValid: {},
    });
});

function Illustration(): JSX.Element {
    const wide = layout.isWideDevice;
    const svgHeight = wide ? 400 : 300;

    const [value, setValue] = useState(0);
    const forceUpdate = () => setValue(value + 1);

    const Svg = getLocalSvg("woman-holding-phone-3", forceUpdate);
    const Blob = getLocalSvg("blob-6", forceUpdate);

    return (
        <View
            style={[
                {height: svgHeight, zIndex: -1},
                !wide && {
                    position: "absolute",
                    top: -200,
                    right: -150,
                },
            ]}
        >
            <Blob width={svgHeight * (350 / 360)} height={svgHeight} viewBox="0 0 350 360" />
            <Svg
                style={{
                    position: "absolute",
                    ...(wide
                        ? {left: svgHeight * 0.075, top: svgHeight * 0.1}
                        : {left: svgHeight * 0.1, top: svgHeight * 0.28}),
                }}
                width={svgHeight * (wide ? 0.9 : 0.7) * (275 / 385)}
                height={svgHeight * (wide ? 0.9 : 0.7)}
                viewBox="0 0 275 385"
            />
        </View>
    );
}

export default reduxConnector(withTheme(OnboardingProfileScreen1));
