// Makes chalk (in Jest/Yarn commands) show colorful output
// See: https://github.com/chalk/chalk#supportscolor
process.env['FORCE_COLOR'] = 3;

const {exec} = require('child_process');
const {readdirSync, readFile} = require('fs');
const util = require('util');

const execAsync = util.promisify(exec);
const readFileAsync = util.promisify(readFile);

const runCommand = async (command, cwd) => {
  const { stdout, stderr } = await execAsync(command, {cwd});

  if (stderr) {
    console.error(stderr);
    return;
  }

  console.log(stdout);
};

const getHasFile = (dir, fileName) => !!readdirSync(dir)
  .filter(dirent => dirent === fileName).length;

const getDirs = (cwd) => readdirSync(cwd, {withFileTypes: true})
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const allPackageDirs = [];

const processDir = (dir) => {
  for (subDir of getDirs(dir)) {
    if (!['node_modules', '.yalc'].includes(subDir)) {
      const cwd = `${dir}/${subDir}`;

      if (getHasFile(cwd, 'package.json')) {
        allPackageDirs.push(cwd);
      }

      processDir(cwd);
    }
  }
};

processDir('./examples');

// Process in reverse order so that child directories are processed first
allPackageDirs.reverse();

const upgradeDir = async (dir) => {
  console.log(`🔵 Upgrading example: ${dir}`);
  console.log('');

  const data = await readFileAsync(`${dir}/package.json`, {encoding: 'utf8'});

  if(!data.includes('@stripe/ui-extension-sdk')) {
    console.log('No SDK, skipping.');
    return;
  }

  // Make sure that Yalc packages have been uninstalled
  await runCommand('type yalc &>/dev/null || exit 0 && yalc check', dir);

  // Upgrade the SDK
  await runCommand('yarn upgrade @stripe/ui-extension-sdk@latest', dir);
};

const main = async () => {
  for (dir of allPackageDirs) {
    await upgradeDir(dir);

    console.log('');
  }

  console.log('✨ Success—all examples upgraded! ✨');
};

main();
