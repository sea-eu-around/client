import {hasCmdArg} from "../../utils.mjs";
import {exec, path} from "../../utils.mjs";

const BUILD_DIR = "./web-build";
const HERE = "deploy-tools/web/gh-pages";

const production = hasCmdArg("--production");
const staging = hasCmdArg("--staging");

async function predeploy() {
    // If both or none are specified
    if (production === staging) {
        console.error("Aborted: please specify a deployment environment (--production or --staging)");
        return;
    }

    const TARGET = production ? "PRODUCTION" : "STAGING";

    // Build app into the web-build directory
    console.log("# Building app");
    await exec("expo build:web", [], {env: {...process.env, TARGET}});
}

predeploy();
