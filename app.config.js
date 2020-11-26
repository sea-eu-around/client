import "dotenv/config";

const TARGET = process.env.TARGET || "STAGING";

const VERSION = "0.0.1";
const ANDROID_VERSION_CODE = 5;

const CLIENT_HTTP = "https";

let CLIENT_HOST;
let EXTRAS = {};

if (TARGET === "PRODUCTION") {
    CLIENT_HOST = "sea-eu-around.lad-dev.team";
    EXTRAS = {
        CLIENT_URL: `${CLIENT_HTTP}://${CLIENT_HOST}`,
        SERVER_URL: "https://api.sea-eu-around.lad-dev.team",
        DEBUG: false,
    };
} else {
    CLIENT_HOST = "staging.sea-eu-around.lad-dev.team";
    EXTRAS = {
        CLIENT_URL: `${CLIENT_HTTP}://${CLIENT_HOST}`,
        SERVER_URL: "https://api-staging.sea-eu-around.lad-dev.team",
        DEBUG: true,
    };
}

export default {
    expo: {
        name: "SEA-EU Around",
        slug: "seaEuAround",
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
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.sea-eu.around",
            buildNumber: VERSION,
        },
        android: {
            package: "com.sea_eu.around",
            versionCode: ANDROID_VERSION_CODE,
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
        },
        web: {
            favicon: "./assets/images/favicon.png",
        },
    },
};
