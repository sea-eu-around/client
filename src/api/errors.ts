import i18n from "i18n-js";
import {HttpStatusCode} from "../constants/http-status";
import {ErrorRequestResponse, RemoteValidationErrors, RequestResponse, UnprocessableEntityRequestResponse} from "./dto";

export const localizeError = (err: string): string => i18n.t(err, {defaultValue: err});

const extractError = ({code, description}: {code: string; description: string}): string => {
    const isMissingLocalization = i18n.t(code, {defaultValue: "missing"}) == "missing";
    return isMissingLocalization ? description : code;
};

export function gatherValidationErrors(resp: RequestResponse): RemoteValidationErrors | undefined {
    if (resp.status == HttpStatusCode.OK) return undefined;
    else {
        const {errorType, description} = resp as ErrorRequestResponse;
        const output: RemoteValidationErrors = {general: extractError({code: errorType, description}), fields: {}};
        if (resp.status == HttpStatusCode.UNPROCESSABLE_ENTITY) {
            const {errors} = resp as UnprocessableEntityRequestResponse;
            //errors.forEach((e) => (output.fields[e.property] = e.codes.map(extractError)));
            // Only keep the first error (makes displaying errors a lot easier)
            errors.forEach((e) => (output.fields[e.property] = extractError(e.codes[0])));
        }
        return output;
    }
}

/**
 * Get the non-specific error field from remote errors. If field-specific errors are available, yields undefined instead.
 * @param errors - Remote validation errors.
 */
export function generalError(errors?: RemoteValidationErrors): string | undefined {
    if (!errors) return undefined;
    else if (Object.keys(errors.fields).length > 0) return undefined;
    else return errors.general;
}
