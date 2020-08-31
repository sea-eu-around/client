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
    },
    fr: {
        welcome: "Bienvenue",
        login: "Connexion",
        signup: "Inscription",
        emailAddress: "Adresse email",
        password: "Mot de passe",
        forgotPassword: "Mot de passe oublié",
    },
};
