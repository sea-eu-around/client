import {OfferValueDto} from "../api/dto";
import {GroupPost, PostComment} from "./groups";
import {UserProfile} from "./user-profile";
import i18n from "i18n-js";

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

/**
 * Filter only the offers that match a given profile.
 * @param offers A list of offer values.
 * @param profile A profile
 * @returns the offers that target the given profile.
 */
export function getMatchingOffers(offers: OfferValueDto[], profile: UserProfile): OfferValueDto[] {
    return offers.filter((o: OfferValueDto) => {
        if (
            (!o.allowFemale && profile.gender === "female") ||
            (!o.allowMale && profile.gender === "male") ||
            (!o.allowOther && profile.gender === "other") ||
            (!o.allowStaff && profile.type === "staff") ||
            (!o.allowStudent && profile.type === "student")
        )
            return false;
        return true;
    });
}

export function formatDateAgo(date: Date): string | 0 {
    const time = new Date().getTime() - date.getTime();

    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;

    const timespans = [
        {unit: "minute", duration: MINUTE},
        {unit: "hour", duration: HOUR},
        {unit: "day", duration: DAY},
        {unit: "week", duration: DAY * 7},
        {unit: "month", duration: DAY * 30},
    ];

    let i = 0;
    while (i < timespans.length && time >= timespans[i].duration) i++;
    i--;

    if (i === -1) return 0;
    if (i === timespans.length - 1) {
        return i18n.t("dateRelative.precise", {
            day: date.getDate(),
            month: i18n.t(`months.${date.getMonth()}`),
            year: date.getFullYear(),
        });
    } else {
        const t = timespans[i];
        const amount = Math.round(time / t.duration);
        return i18n.t("dateRelative.ago", {
            amount,
            unit: i18n.t(`dateUnits.${amount === 1 ? "singular" : "plural"}.${t.unit}`),
        });
    }
}

export function formatPostDate({createdAt, updatedAt}: GroupPost): string {
    /*const tests: Partial<GroupPost>[] = [
        {
            createdAt: new Date("1998-11-01T17:33:55.978Z"),
            updatedAt: new Date("1998-12-01T17:33:55.978Z"),
        },
        {createdAt: new Date("2020-11-08T17:33:55.978Z")},
        {createdAt: new Date("2021-01-01T17:33:55.978Z")},
        {createdAt: new Date("2021-02-03T17:33:55.978Z")},
        {createdAt: new Date("2021-02-08T17:33:55.978Z")},
        {createdAt: new Date("2021-02-10T23:33:55.978Z")},
        {createdAt: new Date(new Date().getTime() - 1000 * 60 * 61)},
        {createdAt: new Date(new Date().getTime() - 1000 * 60 * 60)},
        {createdAt: new Date(new Date().getTime() - 1000 * 60 * 59)},
        {createdAt: new Date(new Date().getTime() - 1000 * 61)},
        {createdAt: new Date(new Date().getTime() - 1000 * 40)},
    ];
    post = {...post, ...tests[10]};*/

    const isEdit = updatedAt.getTime() != createdAt.getTime();

    const createdAgo = formatDateAgo(createdAt);
    let text = createdAgo === 0 ? i18n.t("groups.justPosted") : `${createdAgo}`;

    if (isEdit) {
        const updatedAgo = formatDateAgo(updatedAt);
        text += ` (${updatedAgo === 0 ? i18n.t("groups.justEdited") : i18n.t("groups.editedAgo", {ago: updatedAgo})})`;
    }
    return text;
}

export function formatCommentDate({createdAt, updatedAt}: PostComment): string {
    const isEdit = updatedAt.getTime() != createdAt.getTime();

    const createdAgo = formatDateAgo(createdAt);
    let text = createdAgo === 0 ? i18n.t("groups.justCommented") : `${createdAgo}`;

    if (isEdit) {
        const updatedAgo = formatDateAgo(updatedAt);
        text += ` (${updatedAgo === 0 ? i18n.t("groups.justEdited") : i18n.t("groups.editedAgo", {ago: updatedAgo})})`;
    }
    return text;
}
