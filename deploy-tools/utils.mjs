// Disable eslint to avoid TypeScript warnings
/* eslint-disable */

import {spawn} from "child_process";
import {sep} from "path";

export const path = (str) => str.replace(/\//g, sep);

export const exec = async (cmd, args = [], options = {}) => {
    return new Promise((resolve, reject) => {
        const newProcess = spawn(cmd, args, {shell: true, stdio: "inherit", ...options});
        newProcess.on("exit", () => resolve());
    });
};

export function hasCmdArg(flag) {
    const f = flag.toLowerCase();
    return process.argv.slice(2).findIndex(s => s.toLowerCase() === f) !== -1;
}