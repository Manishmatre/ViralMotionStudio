import { config } from "@remotion/eslint-config-flat";

export default [
  ...config,
  {
    files: ["server/**/*.ts", "dashboard/**/*.ts", "dashboard/**/*.tsx"],
    rules: {
      "@remotion/warn-native-media-tag": "off",
      "@remotion/deterministic-randomness": "off",
      "@remotion/no-string-assets": "off",
      "@remotion/non-pure-animation": "off",
    },
  },
];
