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

const exampleDirs = readdirSync('./examples', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const main = async () => {
  for (const exampleDir of exampleDirs) {
    console.log(`🔵 Testing example: ${exampleDir}`);
    console.log('');

    const cwd = `./examples/${exampleDir}`;

    const hasJestConfig = !!readdirSync(`${cwd}`)
      .filter(dirent => dirent === 'jest.config.ts').length;

    // This check can be removed once all examples have tests
    if (!hasJestConfig) {
      console.log('No tests, skipping.');
    } else {
      // Install dependencies
      await runCommand('yarn install --frozen-lockfile', cwd);

      // Check types
      await runCommand('yarn tsc', cwd);

      // Run tests
      await runCommand('yarn jest', cwd);

      console.log('✅ Tests passed');
    }

    console.log('');
  }

  console.log('✨ Success—all tests passed! ✨');
};

main();
