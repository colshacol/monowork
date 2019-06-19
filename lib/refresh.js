const shell = require('shelljs');
const log = require('./log');
const createPath = require('./createPath');

const { ShellString } = shell;

const getMonorepoPackageJsonPath = () => {
  return createPath('./package.json');
};

const getMonorepoPackageJson = () => {
  const monorepoPackageJsonPath = getMonorepoPackageJsonPath();
  return require(monorepoPackageJsonPath);
};

const getWorkspaces = () => {
  const monorepoPackageJson = getMonorepoPackageJson();
  const { workspaces } = monorepoPackageJson;
  return workspaces;
};

const getPackagePaths = () => {
  const workspaces = getWorkspaces();

  return workspaces.map(workspacePath => {
    if (!workspacePath.endsWith('*')) {
      return createPath(workspacePath);
    }

    const pathWithoutAsterik = workspacePath.replace(/\*/, '');
    const resolvedPath = createPath(pathWithoutAsterik);

    const packagePaths = shell.ls(resolvedPath).map(name => {
      return resolvedPath + '/' + name;
    });

    return packagePaths;
  });
};

const getPackageJsons = packagePaths => {
  return packagePaths.map(packagePath => {
    const packageJsonPath = createPath(`${packagePath}/package.json`);
    return require(packageJsonPath);
  });
};

const getPackageName = packageJson => {
  return packageJson.name.substr(packageJson.name.indexOf('/') + 1);
};

const getPackageNames = packageJsons => {
  return packageJsons.map(getPackageName);
};

const getPackageScripts = packageJsons => {
  return packageJsons.map(packageJson => {
    return Object.entries(packageJson.scripts).map(([name, script]) => {
      const newName = `${getPackageName(packageJson)}:${name}`;
      const newScript = `yarn workspace ${packageJson.name} ${name}`;
      return [newName, newScript];
    });
  });
};

const refresh = (cli, subCommands, options) => {
  const monorepoPackageJsonPath = getMonorepoPackageJsonPath();
  const monorepoPackageJson = getMonorepoPackageJson();
  const allPackagePaths = getPackagePaths().flat();
  const packageJsons = getPackageJsons(allPackagePaths);
  const packageNames = getPackageNames(packageJsons);
  const scripts = getPackageScripts(packageJsons).flat();

  monorepoPackageJson.scripts = {
    ...monorepoPackageJson.scripts,
    ...Object.fromEntries(scripts),
  };

  const packageJsonString = JSON.stringify(monorepoPackageJson, null, 2);
  const packageJsonContent = ShellString(packageJsonString);
  packageJsonContent.to(monorepoPackageJsonPath);
};

module.exports = refresh;
