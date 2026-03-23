import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      "out/**",
      "output/**",
      ".playwright-cli/**",
      "coverage/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      "@next/next/no-img-element": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
];

export default config;
