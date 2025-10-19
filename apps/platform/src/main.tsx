import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeManager } from "@repo/ui";
import { App } from "./app/App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' was not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeManager>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeManager>
  </React.StrictMode>
);
