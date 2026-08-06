import uiExtensionConfig from '@stripe/ui-extension-tools/eslint.config.ui-extension.mjs';

export default [
  ...uiExtensionConfig,
  {
    // React is provided by the UI Extension SDK, not a direct dependency, so
    // pin the version to avoid eslint-plugin-react's "detect" warning.
    settings: {
      react: { version: '17.0' },
    },
  },
];
