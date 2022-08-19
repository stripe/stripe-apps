/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ['test'],
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '\\.[jt]sx?$': [
      '@swc/jest',
      {
        module: {
          type: 'commonjs',
        },
        // Inline snapshots require source maps:
        // https://github.com/facebook/jest/issues/6744
        sourceMaps: 'inline',
      },
    ],
  },
};
