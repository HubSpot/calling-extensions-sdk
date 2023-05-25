import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

const rootNode = document.getElementById("app");
if (!rootNode) {
  throw new Error("The element #app wasn't found");
}
const root = createRoot(rootNode);
root.render(React.createElement(App));
