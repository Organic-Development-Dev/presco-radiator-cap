import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
  typegen: {
    path: "./{app,components,sanity,lib}/**/*.{ts,tsx}",
    schema: "./sanity/extract.json",
    generates: "./sanity.types.ts",
  },
});
