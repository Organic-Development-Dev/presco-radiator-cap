import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "legacy/**", "node_modules/**", "sanity/extract.json", "sanity.types.ts"] },
];

export default config;
