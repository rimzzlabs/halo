import { fileURLToPath } from "node:url";
import { shared } from "@halo/config/vitest";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  shared,
  defineConfig({
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    test: {
      environment: "node",
      include: ["tests/**/*.test.ts"],
    },
  }),
);
