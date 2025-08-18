import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

document.documentElement.classList.remove("dark");
document.body?.classList?.remove("dark");

import "./styles/globals.css";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
