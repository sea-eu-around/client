import {SupportedLocale} from "../localization";
import {ThemeKey} from "../types";

export type UserSettings = {
    theme: ThemeKey;
    locale: SupportedLocale;
};
