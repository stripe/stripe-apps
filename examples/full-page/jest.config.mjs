import uiExtensionJestConfig from '@stripe/ui-extension-tools/jest.config.ui-extension.mjs';

export default {
  ...uiExtensionJestConfig,
  // This example ships no tests yet; don't fail the suite when none are found.
  passWithNoTests: true,
};
