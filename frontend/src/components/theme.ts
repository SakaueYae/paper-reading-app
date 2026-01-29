import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "body, div, p, span, input, textarea, label, a, h1, h2, h3, h4, h5, h6, li, td, th, button, select": {
      color: { _light: "gray.800", _dark: "white" },
    },
  },
});

export const system = createSystem(defaultConfig, config);
