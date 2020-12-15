import {Alert} from "react-native";
import {BACKEND_URL} from "../constants/config";
import {HttpStatusCode} from "../constants/http-status";
import {RequestResponse, TokenDto} from "./dto";

// Request-related types
type Primitive = string | number | boolean | Primitive[] | undefined;
type URLParams = {[key: string]: Primitive};
type URLBodyParams = {[key: string]: Primitive | Primitive[] | URLBodyParams | URLBodyParams[]};

function encodeURIPrimitive(v: Primitive): string {
    return Array.isArray(v)
        ? v.map((v) => encodeURIPrimitive(v)).join(",")
        : encodeURIComponent(v as string | number | boolean);
}

/**
 * Encode parameters for an HTTP request (e.g. param1=value1&param2=value2)
 * @param args - A map that contains argument keys and associated values.
 * @returns the given arguments, formatted into a HTTP request suffix.
 */
export function encodeRequestParams(args: URLParams): string {
    const str = Object.keys(args)
        .filter((key: string) => args[key] !== undefined)
        .map((key: string) => `${key}=${encodeURIPrimitive(args[key])}`)
        .join("&");
    return str.length == 0 ? str : "?" + str;
}

/**
 * Send a request to the backend.
 * @param endpoint - Which endpoint to hit (e.g. auth/login)
 * @param method - Which HTTP method to use (GET, PUT, POST, ...)
 * @param params - The URL parameters (?param1=value1&param2=value2 ...)
 * @param body - The body of the request.
 * @param auth - Whether or not this request should be authenticated.
 * @param verbose - Whether or not to print information about the request and response.
 * @param authToken - The authentication token. If not given, the token from the redux store will be used.
 */
export async function requestBackend(
    endpoint: string,
    method = "GET",
    params: URLParams = {},
    body: URLBodyParams = {},
    authToken: TokenDto | null | undefined = undefined,
    verbose = false,
): Promise<RequestResponse> {
    const headers: {[key: string]: string} = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if (authToken !== undefined) {
        if (authToken === null) {
            console.error(`Cannot authentify request to ${endpoint} : no auth token available.`);
            Alert.alert("A request could not be authenticated.");
            return {errorType: "error.no-auth", description: "Endpoint requires authentication", status: 401};
        } else headers.Authorization = `Bearer ${authToken.accessToken}`;
    }

    const formattedParams = encodeRequestParams(params);
    let response: Response | null = null;

    try {
        if (verbose) {
            console.log(`Sending request: ${method} /${endpoint}${formattedParams}`);
            console.log(`  headers: ${JSON.stringify(headers)}`);
            console.log(`  body   : ${JSON.stringify(body)}`);
        }

        response = await fetch(`${BACKEND_URL}/${endpoint}${formattedParams}`, {
            method,
            headers,
            ...(method == "GET" ? {} : {body: JSON.stringify(body)}),
        });

        let json = {status: response.status, data: {}};
        if (response.status !== HttpStatusCode.NO_CONTENT) json = {...json, ...(await response.json())};

        if (verbose) {
            console.log(`Response from endpoint ${endpoint}:`);
            console.log(json);
        }

        return json;
    } catch (error) {
        console.error(
            `An unexpected error occured with a request to ${endpoint}. ` +
                `Method = ${method}, authToken = ${authToken}, params=${JSON.stringify(params)}, ` +
                `body=${JSON.stringify(body)}`,
        );
        console.error(error);
        console.error("Response received from server:", response);
        return {errorType: "error.unknown", description: "A client-side exception was raised.", status: 400};
    }
}
