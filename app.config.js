const TARGET = process.env.TARGET || "STAGING";

const VERSION = "1.2.1";
const ANDROID_VERSION_CODE = 18;

const CLIENT_HTTP = "https";

let CLIENT_HOST;
let EXTRAS = {};

if (TARGET === "PRODUCTION") {
    CLIENT_HOST = "www.lad-dev.team";
    const SERVER_HOST = "api.sea-eu-around.univ-brest.fr";
    EXTRAS = {
        CLIENT_URL: `${CLIENT_HTTP}://${CLIENT_HOST}`,
        SERVER_HOST,
        SERVER_URL: `https://${SERVER_HOST}`,
        DEBUG: false,
    };
} else {
    CLIENT_HOST = "staging.sea-eu-around.lad-dev.team";
    // const SERVER_HOST = "api-staging.sea-eu-around.lad-dev.team";
    const SERVER_HOST = "192.168.0.32:3000";
    EXTRAS = {
        CLIENT_URL: `${CLIENT_HTTP}://${CLIENT_HOST}`,
        SERVER_HOST,
        SERVER_URL: `http://${SERVER_HOST}`,
        DEBUG: true,
    };
}

export default {
    expo: {
        name: "SEA-EU Around",
        slug: "seaEuAround",
        owner: "sea-eu-around",
        privacy: "unlisted",
        version: VERSION,
        orientation: "portrait",
        userInterfaceStyle: "automatic",
        icon: "./assets/images/icon.png",
        scheme: "sea-eu-around",
        entryPoint: "./src/App.tsx",
        extra: {
            TARGET,
            ...EXTRAS,
        },
        updates: {
            enabled: true,
            fallbackToCacheTimeout: 5000,
        },
        splash: {
            image: "./assets/images/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        assetBundlePatterns: ["**/*"],
        packagerOpts: {
            config: "metro.config.js",
            sourceExts: ["expo.ts", "expo.tsx", "expo.js", "expo.jsx", "ts", "tsx", "js", "jsx", "json", "wasm", "svg"],
        },
        ios: {
            icon: "./assets/images/icon.ios.png",
            supportsTablet: true,
            bundleIdentifier: "com.sea-eu.around",
            buildNumber: VERSION,
        },
        android: {
            package: "com.sea_eu.around",
            versionCode: ANDROID_VERSION_CODE,
            googleServicesFile: "./google-services.json",
            permissions: [],
            intentFilters: [
                {
                    action: "VIEW",
                    data: [
                        {
                            scheme: CLIENT_HTTP,
                            host: CLIENT_HOST,
                            pathPrefix: "/",
                        },
                    ],
                    category: ["BROWSABLE", "DEFAULT"],
                },
            ],
            useNextNotificationsApi: true,
        },
        web: {
            favicon: "./assets/images/favicon.png",
        },
    },
};
