import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { FluentProvider, webDarkTheme } from "@fluentui/react-components";
import { router } from "./routes";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <FluentProvider theme={webDarkTheme}>
      <RouterProvider router={router} />
    </FluentProvider>
  </StrictMode>
);
