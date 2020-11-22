import {Formik, FormikProps} from "formik";
import * as React from "react";
import {Keyboard, KeyboardAvoidingView} from "react-native";
import {FormTextInput} from "../../components/FormTextInput";
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
                            handleSubmit={handleSubmit}
                            {...this.props}
                        >
                            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={200}>
                                <FormTextInput
                                    {...textInputProps("firstname")}
                                    label={i18n.t("firstname")}
                                    autoCompleteType="name"
                                />

                                <FormTextInput
                                    {...textInputProps("lastname")}
                                    label={i18n.t("lastname")}
                                    autoCompleteType="name"
                                />
                            </KeyboardAvoidingView>
                        </OnboardingSlide>
                    );
                }}
            </Formik>
        );
    }
}

export default reduxConnector(withTheme(OnboardingNameScreen));
