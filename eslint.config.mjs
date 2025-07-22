// eslint.config.mjs
import { defineFlatConfig } from "eslint-define-config";
import next from "eslint-config-next/core-web-vitals";

export default defineFlatConfig([
  ...next,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      // Add custom rules if needed
      "no-console": "warn",
      "semi": ["error", "always"],
    },
  },
]);
