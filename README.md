# SEA-EU Around - Client

This is the client repository for SEA-EU Around (android, iOS and web versions).

# Deployment

/!\ Warning: before deploying anything, make sure the [config file](./app.config.ts) is setup correctly.

Resources :

- https://docs.expo.io/distribution/building-standalone-apps/
- https://docs.expo.io/distribution/uploading-apps/
- https://docs.expo.io/distribution/app-signing/

## Android

First, the `versionCode` needs to be incremented in [app.json/expo/android](app.json). Otherwise, the play store won't accept the new build. Then run :
`npm run build-android`

Note that you will need at expo account for this. You can then retrieve the apk on expo.io and upload it to the store manually.

## Web

To deploy the web version to production, run `npm run deploy-web:prod`.
You can also choose to deploy to a staging environment using `npm run deploy-web:staging`.

Here is what happens:
- First, the pre-deployment script runs.
    - The project is built using `expo build:web`.
    - A `CNAME` file is created in the build dir to ensure github-pages is served on our domain.
    - [This trick](https://github.com/rafgraph/spa-github-pages) is applied so our single-page app can handle links correctly. 
- Then, `gh-pages` deploys our app to github pages (on this repository for staging, or the sea-eu-around one for production).

# Contributors

- Kelian Baert (kelian.baert@gmail.com)
- Ladislas Dellinger
- Alfred Pichard
