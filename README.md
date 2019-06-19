# monowork

A friendly `yarn workspaces` helper.

```sh
# install with npm
npm i -g monowork
# or with yarn
yarn add global monowork
```

## Usage

### create

Scaffolds a basic package setup at `packages/<name>` and then refreshes your monorepo root's `package.json`
to include the scripts from your new package.

If `monowork.organizationName` is provided in your monorepo root's `package.json`, then the `name` of your
new package's `package.json` becomes `<organizationName>/<name>`.

```sh
monowork create <name>
```

### refresh

Updates the monorepo root's `package.json` with scripts found from all monorepo packages. This is
useful for when you update a script in one of your packages and want to easily use it without
`cd package/my-package` first.

```sh
monowork refresh
```

![monowork demo](https://github.com/colshacol/foreign-storage/blob/master/images/refresh-demo.gif)

### --help

Gives you basic usage instructions.

```sh
monowork --help
```

## Configuration

Although `monowork` requires no configuration, it does allow you to provide a few options
to customize your usage. Options are specified in your monorepo's root `package.json` under
the `"monowork"` property.

```json
// ./package.json
{
  "monowork": {
    "organizationName": "@foxy-shaman"
  }
}
```
