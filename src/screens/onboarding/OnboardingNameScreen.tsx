import {Formik, FormikProps} from "formik";
import * as React from "react";
import {Keyboard, View} from "react-native";
import {FormTextInput} from "../../components/forms/FormTextInput";
import OnboardingSlide, {OnboardingScreenProps} from "./OnboardingSlide";
import i18n from "i18n-js";
import * as Yup from "yup";
import {VALIDATOR_FIRSTNAME, VALIDATOR_LASTNAME} from "../../validators";
import {getOnboardingTextInputsStyleProps} from "../../styles/forms";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {setOnboardingValues} from "../../state/auth/actions";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {getLocalSvg} from "../../assets";
import layout from "../../constants/layout";
import {useState} from "react";

type OnboardingNameFormState = {
    firstname: string;
    lastname: string;
};

const reduxConnector = connect((state: AppState) => ({
    onboardingState: state.auth.onboarding,
}));

const VALIDATION_SCHEMA = Yup.object().shape({
    firstname: VALIDATOR_FIRSTNAME,
    lastname: VALIDATOR_LASTNAME,
});

type OnboardingNameScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps & OnboardingScreenProps;

class OnboardingNameScreen extends React.Component<OnboardingNameScreenProps> {
    lastNameInputRef = React.createRef<FormTextInput>();

    shouldComponentUpdate(nextProps: Readonly<OnboardingNameScreenProps>) {
        const prev = this.props.onboardingState;
        const next = nextProps.onboardingState;
        return prev.firstname != next.firstname || prev.lastname != next.lastname;
    }

    submit(values: OnboardingNameFormState) {
        Keyboard.dismiss();
        this.props.dispatch(setOnboardingValues(values));
        this.props.next();
    }

    render(): JSX.Element {
        const {theme, onboardingState} = this.props;

        return (
            <Formik
                initialValues={onboardingState as OnboardingNameFormState}
                validationSchema={VALIDATION_SCHEMA}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={(values: OnboardingNameFormState) => this.submit(values)}
            >
                {(formikProps: FormikProps<OnboardingNameFormState>) => {
                    const {handleSubmit, values, errors, touched, handleChange, handleBlur} = formikProps;
                    const textInputProps = (field: string) => ({
                        field,
                        value: (values as {[key: string]: string})[field],
                        error: (errors as {[key: string]: string | undefined})[field],
                        touched: (touched as {[key: string]: boolean | undefined})[field],
                        handleChange,
                        handleBlur,
                        ...getOnboardingTextInputsStyleProps(theme),
                    });

                    return (
                        <OnboardingSlide
                            title={i18n.t("onboarding.name.title")}
                            subtitle={i18n.t("onboarding.name.subtitle")}
                            illustration={<Illustration />}
                            handleSubmit={handleSubmit}
                            {...this.props}
                        >
                            <FormTextInput
                                {...textInputProps("firstname")}
                                label={i18n.t("firstname")}
                                placeholder={i18n.t("firstname")}
                                autoCompleteType="name"
                                enablesReturnKeyAutomatically={true}
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => this.lastNameInputRef.current?.focus()}
                            />

                            <FormTextInput
                                {...textInputProps("lastname")}
                                ref={this.lastNameInputRef}
                                label={i18n.t("lastname")}
                                placeholder={i18n.t("lastname")}
                                autoCompleteType="name"
                                enablesReturnKeyAutomatically={true}
                                returnKeyType="done"
                                onSubmitEditing={() => handleSubmit()}
                            />
                        </OnboardingSlide>
                    );
                }}
            </Formik>
        );
    }
}

function Illustration(): JSX.Element {
    const wide = layout.isWideDevice;
    const svgWidth = wide ? 600 : 380;
    const svgHeight = wide ? 350 : 200;

    const [value, setValue] = useState(0);
    const forceUpdate = () => setValue(value + 1);

    const Svg1 = getLocalSvg("woman-holding-phone-2", () => forceUpdate());
    const Svg2 = getLocalSvg("man-holding-phone", () => forceUpdate());
    const Blob1 = getLocalSvg("blob-4", () => forceUpdate());
    const Blob2 = getLocalSvg("blob-5", () => forceUpdate());

    return (
        <View
            style={{
                width: svgWidth,
                height: svgHeight,
                alignSelf: "center",
            }}
        >
            <Blob1
                style={{position: "absolute", left: 0, top: 0}}
                width={svgHeight * (260 / 250)}
                height={svgHeight}
                viewBox="0 0 260 250" // necessary for web
                preserveAspectRatio="xMinYMid"
            />
            <Svg1
                style={{position: "absolute", left: svgWidth * 0.15, top: svgHeight * 0.1}}
                width={svgHeight * 0.8 * (140 / 200)}
                height={svgHeight * 0.8}
                viewBox="0 0 140 200"
                preserveAspectRatio="xMinYMid"
            />
            <Blob2
                style={{position: "absolute", right: 0}}
                width={svgHeight * (250 / 275)}
                height={svgHeight}
                viewBox="0 0 250 275"
                preserveAspectRatio="xMaxYMid"
            />
            <Svg2
                style={{position: "absolute", right: svgWidth * 0.12, top: svgHeight * 0.1}}
                width={svgHeight * 0.8 * (150 / 200)}
                height={svgHeight * 0.8}
                viewBox="0 0 150 200"
                preserveAspectRatio="xMaxYMid"
            />
        </View>
    );
}

export default reduxConnector(withTheme(OnboardingNameScreen));
