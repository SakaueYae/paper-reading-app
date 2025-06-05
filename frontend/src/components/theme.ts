import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        text: {
          DEFAULT: {
            value: { _light: "gray.800", _dark: "white" },
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
