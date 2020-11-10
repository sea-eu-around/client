import * as Yup from "yup";
import {DEGREES} from "../constants/profile-constants";
import {PARTNER_UNIVERSITIES, University} from "../constants/universities";

export const MIN_PASSWORD_LENGTH = 8;

// TODO move this validation to back-end
const VALID_EMAIL_DOMAINS = PARTNER_UNIVERSITIES.map((uni: University) => uni.domain);

export const VALIDATOR_EMAIL_SIGNUP = Yup.string()
    .required("validation.required")
    .email("validation.email.invalid")
    .test("email-domain", "validation.email.invalidDomain", (value: string | null | undefined) => {
        return value !== null && value !== undefined && VALID_EMAIL_DOMAINS.some((domain) => value.endsWith(domain));
    });

export const VALIDATOR_PASSWORD_SIGNUP = Yup.string()
    .required("validation.required")
    .min(MIN_PASSWORD_LENGTH, "validation.password.tooShort")
    // At least one digit
    .matches(/(?=.*\d)/, "validation.password.noDigit")
    // At least one lower-case character
    .matches(/(?=.*[a-z])/, "validation.password.noLowerCase")
    // At least one upper-case character
    .matches(/(?=.*[A-Z])/, "validation.password.noUpperCase")
    // At least one symbol
    .matches(/(?=.*[#@$!%*?&])/, "validation.password.noSymbol");

export const VALIDATOR_PASSWORD_REPEAT = Yup.string()
    .required("validation.required")
    .oneOf([Yup.ref("password")], "validation.password.repeatWrong");

export const VALIDATOR_EMAIL_LOGIN = Yup.string().required("validation.required").email("validation.email.invalid");
export const VALIDATOR_PASSWORD_LOGIN = Yup.string().required("validation.required");

export const VALIDATOR_FIRSTNAME = Yup.string().trim().required("validation.required");

export const VALIDATOR_LASTNAME = Yup.string().trim().required("validation.required");

export const VALIDATOR_ONBOARDING_BIRTHDATE = Yup.date().nullable().required("validation.required"); // make it nullable so we can use null to represent a non given value (will fail the 'required' test anyway)
export const VALIDATOR_ONBOARDING_GENDER = Yup.string().nullable().required("validation.required");
export const VALIDATOR_ONBOARDING_NATIONALITY = Yup.string().nullable().required("validation.required");
export const VALIDATOR_ONBOARDING_DEGREE = Yup.string().oneOf(DEGREES, "validation.required");
export const VALIDATOR_ONBOARDING_LANGUAGES = Yup.array().required("validation.addAtLeastOne");
