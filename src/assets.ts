import i18n from "i18n-js";
import {SvgProps} from "react-native-svg";
import SvgPlaceholder from "./components/SvgPlaceholder";
import {SupportedLocale} from "./localization";

const loaded: {[key: string]: number} = {};

async function assetDictCommon(key: string): Promise<unknown> {
    switch (key) {
        case "offers.categories.discover":
            return import("@assets/images/offers/discover.svg");
        case "offers.categories.meet":
            return import("@assets/images/offers/meet.svg");
        case "offers.categories.collaborate":
            return import("@assets/images/offers/collaborate.svg");
        default:
            return import("@assets/images/placeholder.png");
    }
}

async function assetDictEn(key: string): Promise<unknown> {
    switch (key) {
        case "logos.erasmusLeft":
            return import("@assets/images/logos/logosbeneficaireserasmusleft_en_0.png");
        default:
            return null;
    }
}

async function assetDictFr(key: string): Promise<unknown> {
    switch (key) {
        case "logos.erasmusLeft":
            return import("@assets/images/logos/logosbeneficaireserasmusleft_fr_0.png");
        default:
            return null;
    }
}

// TODO refresh on locale change

export function getLocalImage(key: string, onLoad: () => void): number {
    if (loaded[key]) return loaded[key];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finish = (v: any) => {
        loaded[key] = v.default;
        onLoad();
    };

    const locale = i18n.currentLocale() as SupportedLocale;
    const localizedDict = locale === "en" ? assetDictEn : assetDictFr;

    localizedDict(key).then((v) => {
        // Fallback to the common dict if needed
        if (v === null) assetDictCommon(key).then((v) => finish(v));
        else finish(v);
    });

    return 0;
}

export function getLocalSvg(key: string, onLoad: () => void): React.FC<SvgProps> {
    const raw = getLocalImage(key, onLoad);
    if (raw === 0) return SvgPlaceholder;
    return (raw as unknown) as React.FC<SvgProps>;
}
