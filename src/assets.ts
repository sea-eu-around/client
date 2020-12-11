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
        case "offers.categories.discover":
            return import("@assets/images/offers/discover.svg");
        case "offers.categories.meet":
            return import("@assets/images/offers/meet.svg");
        case "offers.categories.collaborate":
            return import("@assets/images/offers/collaborate.svg");
        case "logos.junior-atlantique":
            return theme === "light"
                ? import("@assets/images/logos/junior-atlantique-light.png")
                : import("@assets/images/logos/junior-atlantique-dark.png");
        case "logos.sea-eu-around.small":
            return import("@assets/images/logos/sea-eu-around.small.png");
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

export function getLocalImage(key: string, onLoad: () => void): number {
    const settings = store.getState().settings.userSettings;
    if (locale != settings.locale || theme != settings.theme) loaded = {};
    locale = settings.locale;
    theme = settings.theme;

    if (loaded[key]) return loaded[key];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finish = (v: any) => {
        loaded[key] = v.default;
        onLoad();
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

export function getLocalSvg(key: string, onLoad: () => void): React.FC<SvgProps> {
    const raw = getLocalImage(key, onLoad);
    if (raw === 0) return SvgPlaceholder;
    return (raw as unknown) as React.FC<SvgProps>;
}
