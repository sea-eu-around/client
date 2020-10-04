/**
 * Encode arguments for an HTTP request (e.g. ?param1=value1&param2=value2)
 * @param args - A map that contains argument keys and associated values.
 * @returns the given arguments, formatted into a HTTP request suffix.
 */
export function encodeRequestArguments(args: {[key: string]: string | number | boolean}): string {
    const keys = Object.keys(args);
    if (keys.length == 0) return "";
    else {
        return "?" + keys.map((key: string) => `${key}=${encodeURIComponent(args[key])}`).join("&");
    }
}
