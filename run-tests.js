// Makes chalk (in Jest/Yarn commands) show colorful output
// See: https://github.com/chalk/chalk#supportscolor
process.env['FORCE_COLOR'] = 3;

const {exec} = require('child_process');
const { readdirSync } = require('fs');
const util = require('util');

const execAsync = util.promisify(exec);

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

const testDir = async (dir) => {
  console.log(`🔵 Testing example: ${dir}`);
  console.log('');

  // Make sure that Yalc packages have been uninstalled
  await runCommand('type yalc &>/dev/null || exit 0 && yalc check', dir);

  // Install dependencies
  await runCommand('yarn install --frozen-lockfile', dir);

  if (getHasFile(dir, 'tsconfig.json')) {
    // Check types
    try {
      await runCommand('yarn tsc --noEmit', dir);
    } catch (e) {
      console.error(`${dir}: Type checking failed: `, e);
      process.exit(1);
    }
  }

  // This check can be removed once all examples have tests
  if (!getHasFile(dir, 'jest.config.ts')) {
    console.log('No tests, skipping.');
  } else {
    // Run tests
    try {
      await runCommand('yarn jest', dir);
    } catch (e) {
      console.error('Test suite failed: ', e);
      process.exit(2);
    }

    console.log('✅ Tests passed');
  }
};

const main = async () => {
  for (dir of allPackageDirs) {
    await testDir(dir);

    console.log('');
  }

  console.log('✨ Success—all tests passed! ✨');
};

main();
