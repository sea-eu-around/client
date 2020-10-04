export function encodeRequestArguments(args: {[key: string]: string | number | boolean}): string {
    const keys = Object.keys(args);
    if (keys.length == 0) return "";
    else {
        return "?" + keys.map((key: string) => `${key}=${encodeURIComponent(args[key])}`).join("&");
    }
}
