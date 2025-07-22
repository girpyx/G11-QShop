// eslint.config.js
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
      "no-console": "warn",
      "semi": ["error", "always"],
    },
  },
]);
