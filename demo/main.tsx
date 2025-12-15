import { createRoot } from "react-dom/client";
import App from "./App";
import { OryxProvider } from "../src";

createRoot(document.getElementById("root")!).render(
  <OryxProvider>
    <App />
  </OryxProvider>,
);
