const path = require("path")
const shell = require("shelljs")
const log = require("./log")
const createPath = require("./createPath")
const refresh = require("./refresh")

const { ShellString } = shell
const cwd = process.cwd()

const generatePaths = name => {
  const root = createPath(`./packages`)
  const monorepoPackageJson = createPath(`./package.json`)
  const package = createPath(`${root}/${name}`)
  const readme = createPath(`${package}/README.md`)
  const packageJson = `${package}/package.json`
  const packageName = `@tcs-design-tools-common/${name}`
  const src = createPath(`${package}/src`)
  const index = createPath(`${src}/index.ts`)

  return {
    root,
    package,
    monorepoPackageJson,
    packageJson,
    packageName,
    readme,
    src,
    index
  }
}

const getPackageName = (organizationName, name) => {
  const prefix = organizationName ? `${organizationName}/` : ""
  const packageName = `${prefix}${name}`.trim()
  return packageName
}

const create = (cli, subCommands, options) => {
  const [name] = subCommands
  const paths = generatePaths(name)
  const monorepoPackageJson = require(paths.monorepoPackageJson)
  const monoworkConfig = monorepoPackageJson.monowork

  const validateCategory = () => {
    const exists = shell.test("-d", paths.category)
    exists || halt("category does not exist")
  }

  const validateName = () => {
    const exists = shell.test("-d", paths.package)
    exists && halt("directory already exists")
  }

  const createDirectory = () => {
    shell.mkdir(paths.package)
    log.green("[monowork created the directory]")
  }

  const createReadme = () => {
    const readmeContent = ShellString(`# ${name}`)
    shell.touch(paths.readme)
    readmeContent.to(paths.readme)
    log.green("[monowork created readme]")
  }

  const createPackageJson = () => {
    const packageJson = {}
    const packageName = getPackageName(monoworkConfig.organizationName, name)

    shell.touch(paths.packageJson)
    packageJson.name = packageName
    packageJson.version = "0.0.0"
    packageJson.dependencies = {}
    packageJson.devDependencies = {}
    packageJson.peerDependencies = {}
    packageJson.files = []
    packageJson.scripts = {}
    packageJson.scripts["start"] = "foo"
    packageJson.scripts["build"] = "bar"
    packageJson.scripts["lint"] = "baz"
    packageJson.scripts["test"] = "bah"
    packageJson.module = "dist/index.mjs"
    packageJson.main = "dist/index.js"

    const packageJsonString = JSON.stringify(packageJson, null, 2)
    const packageJsonContent = ShellString(packageJsonString)

    packageJsonContent.to(paths.packageJson)
    log.green("[monowork created package.json]")
  }

  const createSrcDirectory = () => {
    shell.mkdir(paths.src)
    log.green(`[monowork created src directory]`)
  }

  const createEntryPoint = () => {
    shell.touch(paths.index)
    log.green(`[monowork created index.ts]`)
  }

  const updateMonorepoPackageJson = () => {
    monorepoPackageJson.scripts[`${name}:start`] = "foo"
    monorepoPackageJson.scripts[`${name}:build`] = "bar"
    monorepoPackageJson.scripts[`${name}:lint`] = "baz"
    monorepoPackageJson.scripts[`${name}:test`] = "bah"

    const packageJsonString = JSON.stringify(monorepoPackageJson, null, 2)
    const packageJsonContent = ShellString(packageJsonString)

    packageJsonContent.to(paths.monorepoPackageJson)
    log.green("[monowork updated monorepo package.json]")
  }

  const alertSuccess = () => {
    log.green(`[monowork is done]`)
  }

  validateCategory()
  validateName()
  createDirectory()
  createReadme()
  createPackageJson()
  createSrcDirectory()
  createEntryPoint()
  updateMonorepoPackageJson()
  alertSuccess()
  refresh(cli, subCommands, options)
}

module.exports = create
