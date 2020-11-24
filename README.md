# SEA-EU Around - Client

This is the client repository for SEA-EU Around (android, iOS and web versions).

# Deployment

/!\ Warning: before deploying anything, make sure the [config file](src/constants/config.ts) is setup correctly.

## Android

First, the `versionCode` needs to be incremented in [app.json/expo/android](app.json). Otherwise, the play store won't accept the new build.  
`expo build:android -t apk`

## Web

To deploy the web version to production, run `npm run deploy-web`.

Here is what happens:
- First, the pre-deployment script runs.
    - The project is built using `expo build:web`.
    - A `CNAME` file is created in the build dir to ensure github-pages is served on our domain.
    - [This trick](https://github.com/rafgraph/spa-github-pages) is applied so our single-page app can handle links correctly. 
- Then, `gh-pages` deploys our app to github pages.

# Contributors

- Kelian Baert (kelian.baert@gmail.com)
- Ladislas Dellinger
- Alfred Pichard
