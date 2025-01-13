import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "./components/ui/chakraui/provider.tsx";
import { BrowserRouter } from "react-router";
import { ColorModeProvider } from "./components/ui/chakraui/color-mode.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <ColorModeProvider>
          <App />
        </ColorModeProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
