# Contributing

Use Node.js 24 and install the dependencies locked for this package.

```sh
nvm use
npm ci
```

Set `APIKEY` in a local `.env` file and set `REFERRER` to a URL allowed for that
key. The shared webpack configuration in `@yandex/ymaps3-cli` 0.0.25 reads
`APIKEY` even for production builds. Jest uses both values to load the Maps JS API.

```sh
npm start
```

To check a change locally, run the following commands.

```sh
npm run lint
npm run build
npm test
npm pack --dry-run
```

## Development loader

Load the local build from `dist` during development.

```js
ymaps3.import.loaders.unshift(async (pkg) => {
    if (!pkg.startsWith('@yandex/ymaps3-drawer-control')) return;

    // Load script from dev server
    await ymaps3.import.script(`./dist/index.js`);

    return window['@yandex/ymaps3-drawer-control'];
});
```

## GitHub Actions

The `build` job runs on pull requests targeting `main` and pushes to `main`.
It installs dependencies, lints, builds, runs integration tests and inspects the npm
package. Configure the repository secrets `APIKEY` and `REFERRER` for these checks.
GitHub withholds repository secrets from fork pull requests, so their build and
integration checks require a maintainer to review the code and run it on a trusted branch.

## Publishing

Configure a GitHub Actions trusted publisher for the existing npm package
`@yandex/ymaps3-drawer-control`. Use owner `yandex`, repository
`ymaps3-drawer-control`, workflow filename `release.yml` and an empty environment.
Enable direct npm publishing.

To release a patch from an up-to-date, clean `main`, run `npm run bump`.
This commits the two version manifests and atomically pushes `main` and the new tag
to `origin`. The push starts the release workflow.

A release tag must match the package version exactly, and its commit must belong
to the history of `main`. For a manual run, select the version tag. After the checks
pass, the workflow publishes with OIDC. Stable versions go to `latest` and
prerelease versions go to `next`.
