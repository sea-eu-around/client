/**
 * Attempts to extract names from a given email.
 * @param email A valid email address.
 * @returns the first and last name if they were successfuly extracted, null otherwise.
 */
export function extractNamesFromEmail(email: string): {firstname: string; lastname: string} | null {
    const splitName = email.split("@")[0].split(".");
    const capitalize = (str: string) => (str.length == 0 ? str : str[0].toUpperCase() + str.slice(1));
    return splitName.length >= 2
        ? {
              firstname: capitalize(splitName[0]),
              lastname: capitalize(splitName[1]),
          }
        : null;
}
