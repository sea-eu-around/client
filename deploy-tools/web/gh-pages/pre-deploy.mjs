import {readFile, writeFile} from "fs";
import {exec, path} from "../../utils.mjs";

const BUILD_DIR = "./web-build";
const HERE = "deploy-tools/web/gh-pages";

const INDEX_HTML = path(`${BUILD_DIR}/index.html`);
const DOMAIN = "sea-eu-around.lad-dev.team";

async function predeploy() {
    // Build app into the web-build directory
    console.log("# Building app");
    await exec("expo build:web");

    // Create the CNAME file to specify the deployment domain
    console.log("# Echoing CNAME");
    await exec(`echo ${DOMAIN} > ${path(`${BUILD_DIR}/CNAME`)}`);

    /* See https://github.com/rafgraph/spa-github-pages for the next two steps */

    // Copy the 404 page
    console.log("# Copying 404.html");
    await exec("copy", [path(`${HERE}/404.html`), path(`${BUILD_DIR}/404.html`)]);

    // Append the redirect script to index.html
    console.log("# Appending redirect script to index.html");
    const SINGLE_PAGE_SCRIPT = `
    <!-- Start Single Page Apps for GitHub Pages -->
        <script type="text/javascript">
            // Single Page Apps for GitHub Pages
            // MIT License
            // https://github.com/rafgraph/spa-github-pages
            // This script checks to see if a redirect is present in the query string,
            // converts it back into the correct url and adds it to the
            // browser's history using window.history.replaceState(...),
            // which won't cause the browser to attempt to load the new url.
            // When the single page app is loaded further down in this file,
            // the correct url will be waiting in the browser's history for
            // the single page app to route accordingly.
            (function(l) {
                if (l.search[1] === '/' ) {
                var decoded = l.search.slice(1).split('&').map(function(s) { 
                    return s.replace(/~and~/g, '&')
                }).join('?');
                window.history.replaceState(null, null,
                    l.pathname.slice(0, -1) + decoded + l.hash
                );
                }
            }(window.location))
        </script>
    <!-- End Single Page Apps for GitHub Pages -->`;

    readFile(INDEX_HTML, "utf8", (err, data) => {
        if (err) return console.log(err);

        // Insert the script right before </head>
        const output = data.replace(/<\/head>/g, `${SINGLE_PAGE_SCRIPT}</head>`);

        writeFile(INDEX_HTML, output, "utf8", (err) => {
            if (err) return console.log(err);
            else console.log("Done.");
        });
    });
}

predeploy();
