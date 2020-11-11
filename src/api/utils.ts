import {BACKEND_URL} from "../constants/config";
import store from "../state/store";

export type Primitive = string | number | boolean;
export type URLParams = {[key: string]: Primitive};
export type URLBodyParams = {[key: string]: Primitive | Primitive[] | URLBodyParams | URLBodyParams[]};
export type RequestResponse = {success: boolean; codes: string[]} & {[key: string]: unknown};

/**
 * Encode parameters for an HTTP request (e.g. param1=value1&param2=value2)
 * @param args - A map that contains argument keys and associated values.
 * @returns the given arguments, formatted into a HTTP request suffix.
 */
export function encodeRequestParams(args: URLParams): string {
    const keys = Object.keys(args);
    if (keys.length == 0) return "";
    else {
        return keys.map((key: string) => `${key}=${encodeURIComponent(args[key])}`).join("&");
    }
}

/**
 * Send a request to the backend.
 * @param endpoint - Which endpoint to hit (e.g. auth/login)
 * @param method - Which HTTP method to use (GET, PUT, POST, ...)
 * @param params - The URL parameters (?param1=value1&param2=value2 ...)
 * @param body - The body of the request.
 * @param auth - Whether or not this request should be authenticated.
 */
export async function requestBackend(
    endpoint: string,
    method = "GET",
    params: URLParams = {},
    body: URLBodyParams = {},
    auth = false,
    verbose = false,
): Promise<RequestResponse> {
    const headers: {[key: string]: string} = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if (auth) {
        const token = store.getState().auth.token;
        if (token) headers.Authorization = `Bearer ${token.accessToken}`;
        else {
            console.error(`Cannot authentify request to ${endpoint} : no auth token available.`);
            return {success: false, codes: ["error.no-auth"]};
        }
    }

    const formattedParams = encodeRequestParams(params);

    try {
        if (verbose) {
            console.log(`Sending request: ${method} /${endpoint}?${formattedParams}`);
            console.log(`  headers: ${JSON.stringify(headers)}`);
            console.log(`  body   : ${JSON.stringify(body)}`);
        }

        const response = await fetch(`${BACKEND_URL}/${endpoint}?${formattedParams}`, {
            method,
            headers,
            ...(method == "GET" ? {} : {body: JSON.stringify(body)}),
        });

        const json = await response.json();
        if (verbose) {
            console.log(`Response from endpoint ${endpoint}:`);
            console.log(json);
        }

        return json;
    } catch (error) {
        console.error(
            `An unexpected error occured with a request to ${endpoint}. ` +
                `Method = ${method}, auth = ${auth}, params=${JSON.stringify(params)}, body=${JSON.stringify(body)}`,
        );
        return {success: false, codes: ["error.unknown"]};
    }
}
