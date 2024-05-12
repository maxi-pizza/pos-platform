import "../css/main.scss";
import React from "react";
import ReactDOM from "react-dom";

import LoyaltyApp from "./loyalty/app";
import { extractSalesboxOrderIdFromComment } from "./utils.js";

ReactDOM.render(<LoyaltyApp />, document.getElementById("app-container"));

window.refreshBuild = () => {
  // todo: also refresh styles
  const scripts = document.querySelectorAll("script");
  const script = [...scripts].find(
    (script) => script.src.indexOf("https://localhost:5173") !== -1,
  );
  const newScript = document.createElement("script");
  const [src] = script.src.split("?");
  newScript.src = src + "?" + Date.now();
  console.log("script tag removed", newScript.src);
  document.head.appendChild(newScript);
  console.log("script tag added", script.src);
  document.head.removeChild(script);
};

window.runTests = () => {
  const testExtraction = (name, comment, expected) => {
    const actual = extractSalesboxOrderIdFromComment(comment);
    if (expected !== actual) {
      throw new Error({
        actual,
        expected,
      });
    }
    console.log("[extractSalesboxOrderIdFromComment]", name, "passed");
  };
  testExtraction(
    "extract order id when preceded by other text",
    "Пін код під'їзда 5737, не телефонуйте; SalesboxOrderID: d71876ce-c3e7-4b87-be1e-283fea769ea3",
    "d71876ce-c3e7-4b87-be1e-283fea769ea3",
  );
  testExtraction(
    "extract order id when not preceded by other text",
    "; SalesboxOrderID: d71876ce-c3e7-4b87-be1e-283fea769ea3",
    "d71876ce-c3e7-4b87-be1e-283fea769ea3",
  );
  testExtraction(
    "doesn't salesbox order id when there is no salesbox id",
    "blab some text blabla;",
    null,
  );
};
