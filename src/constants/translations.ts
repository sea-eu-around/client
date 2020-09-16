import {MIN_PASSWORD_LENGTH} from "../validators";

export default {
    en: {
        welcome: "Welcome",
        name: "Charlie",
        login: "Login",
        signup: "Sign up",
        emailAddress: "Email address",
        password: "Password",
        passwordRepeat: "Repeat password",
        send: "Send",
        forgotPassword: "Forgot Password",
        newPassword: "New Password",
        forgotPasswordExplanation:
            "Enter the email address associated with your account below. Instructions for choosing a new password will be sent shortly.",
        cancel: "Cancel",
        signupWelcome: "We can't wait for you to join our community!\n\nJust one more step.",
        firstname: "First name",
        lastname: "Last name",
        tosLabel: "I have read and agree to the Terms of Service and Privacy Policy",
        emailNotificationsLabel: "Send me useful notifications by email.",
        createAccount: "Create account",
        validation: {
            required: "Required field.",
            email: {
                invalid: "Please provide a valid email address.",
                invalidDomain: "Your email address must match one of our partner universities.",
            },
            password: {
                tooShort: `Your password must have at least ${MIN_PASSWORD_LENGTH} characters.`,
                noDigit: "Your password must contain at least one digit.",
                noUpperCase: "Your password must contain at least one upper case character.",
                noLowerCase: "Your password must contain at least one lower case character.",
                repeatWrong: "These passwords don't match.",
            },
            tosAccept: "You cannot continue without agreeing to our Terms of Service and Privacy Policy.",
        },
        pageNotFound: "404: Page not found.",
        pageDoesntExist: "This page doesn't exist.",
        goHome: "Go to home screen",
        profile: "Profile",
        myProfile: "My Profile",
        editProfile: "Edit profile",
        educationFields: {
            "field-00": "Generic programmes and qualifications",
            "field-01": "Education",
            "field-02": "Arts and humanities",
            "field-03": "Social sciences, journalism and information",
            "field-04": "Business, administration and law",
            "field-05": "Natural sciences, mathematics and statistics",
            "field-06": "Information and Communication Technologies",
            "field-07": "Engineering, manufacturing and construction",
            "field-08": "Agriculture, forestry, fisheries and veterinary",
            "field-09": "Health and welfare",
            "field-10": "Services",
        },
        levelOfStudy: "Level of study",
        nationality: "Nationality",
        search: "Search",
        selectCountry: "Select country",
        countryPickerLanguageCode: "common", // see TranslationLanguageCode from react-native-country-picker-modal
        role: "Role",
        roles: {
            student: "Student",
            staff: "Staff",
        },
        staffRoles: {
            teaching: "Teaching",
            researcher: "Researcher",
            supporting: "Supporting",
            administrative: "Administrative",
            technical: "Technical",
            ambassador: "SEA-EU Ambassador",
        },
        gender: "Gender",
        genders: {
            M: "Male",
            F: "Female",
        },
    },
    fr: {
        welcome: "Bienvenue",
        login: "Connexion",
        signup: "Inscription",
        emailAddress: "Adresse email",
        password: "Mot de passe",
        forgotPassword: "Mot de passe oublié",
        educationFields: {
            "field-00": "Programmes et certifications génériques",
            "field-01": "Éducation",
            "field-02": "Lettres et arts",
            "field-03": "Sciences sociales, journalisme et information",
            "field-04": "Commerce, administration et droit",
            "field-05": "Sciences naturelles, mathématiques et statistiques",
            "field-06": "Technologies de l’information et de la communication",
            "field-07": "Ingénierie, industries de transformation et construction ",
            "field-08": "Agriculture, sylviculture, halieutique et sciences vétérinaires",
            "field-09": "Santé et protection sociale",
            "field-10": "Services",
        },
        countryPickerLanguageCode: "fra", // see TranslationLanguageCode from react-native-country-picker-modal
    },
};
