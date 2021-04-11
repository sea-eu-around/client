import {SvgProps} from "react-native-svg";
import SvgPlaceholder from "./components/SvgPlaceholder";
import {SupportedLocale} from "./localization";
import store from "./state/store";
import {ThemeKey} from "./types";

let loaded: {[key: string]: number} = {};
let locale: SupportedLocale | null = null;
let theme: ThemeKey | null = null;

async function assetDictCommon(theme: ThemeKey, key: string): Promise<unknown> {
    switch (key) {
        case "welcome":
            return import("@assets/images/welcome.svg");
        case "login-header":
            return import("@assets/images/login.svg");
        case "offers.categories.discover":
            return import("@assets/images/offers/discover.svg");
        case "offers.categories.meet":
            return import("@assets/images/offers/meet.svg");
        case "offers.categories.collaborate":
            return import("@assets/images/offers/collaborate.svg");
        case "background.onboarding":
            return import("@assets/images/background.svg");
        case "large-wave-bg":
            return import("@assets/images/large-wave-bg.svg");
        case "woman-holding-phone":
            return import("@assets/images/woman-holding-phone.svg");
        case "woman-holding-phone-2":
            return import("@assets/images/woman-holding-phone-2.svg");
        case "woman-holding-phone-3":
            return import("@assets/images/woman-holding-phone-3.svg");
        case "woman-holding-phone-4":
            return import("@assets/images/woman-holding-phone-4.svg");
        case "man-holding-phone":
            return import("@assets/images/man-holding-phone.svg");
        case "blob-4":
            return import("@assets/images/blob-4.svg");
        case "blob-5":
            return import("@assets/images/blob-5.svg");
        case "blob-6":
            return import("@assets/images/blob-6.svg");
        case "blob-8":
            return import("@assets/images/blob-8.svg");
        case "blob-9":
            return import("@assets/images/blob-9.svg");
        case "blob-10":
            return import("@assets/images/blob-10.svg");
        case "blob-11":
            return import("@assets/images/blob-11.svg");
        case "staff":
            return import("@assets/images/staff.svg");
        case "student":
            return import("@assets/images/student.svg");
        case "logos.sea-eu-around.small":
            return import("@assets/images/logos/sea-eu-around.small.png");
        case "store-button.android":
            return import("@assets/images/store-android.png");
        case "store-button.ios":
            return import("@assets/images/store-ios.svg");
        case "group-placeholder":
            return import("@assets/images/group-placeholder.png");
        default:
            return import("@assets/images/placeholder.png");
    }
}

async function assetDictEn(theme: ThemeKey, key: string): Promise<unknown> {
    switch (key) {
        case "logos.erasmusLeft":
            return import("@assets/images/logos/logosbeneficaireserasmusleft_en_0.png");
        default:
            return null;
    }
}

async function assetDictFr(theme: ThemeKey, key: string): Promise<unknown> {
    switch (key) {
        case "logos.erasmusLeft":
            return import("@assets/images/logos/logosbeneficaireserasmusleft_fr_0.png");
        default:
            return null;
    }
}

export function getLocalImage(key: string, onLoad?: () => void): number {
    const settings = store.getState().settings.userSettings;
    if (locale != settings.locale || theme != settings.theme) loaded = {};
    locale = settings.locale;
    theme = settings.theme;

    if (loaded[key]) return loaded[key];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finish = (v: any) => {
        loaded[key] = v.default;
        if (onLoad) onLoad();
    };

    const localizedDict = locale === "en" ? assetDictEn : assetDictFr;

    localizedDict(theme, key).then((v) => {
        // Fallback to the common dict if needed
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (v === null) assetDictCommon(theme!, key).then((v) => finish(v));
        else finish(v);
    });

    return 0;
}

export function getLocalSvg(key: string, onLoad?: () => void): React.FC<SvgProps> {
    const raw = getLocalImage(key, onLoad);
    if (raw === 0) return SvgPlaceholder;
    return (raw as unknown) as React.FC<SvgProps>;
}
