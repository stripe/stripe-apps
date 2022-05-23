import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  roots: ['./src'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/src/mocks/fileMock.tsx',
  },
};

export default config;
