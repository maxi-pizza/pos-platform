import "../css/main.scss";
import React from "react";
import ReactDOM from "react-dom";

import LoyaltyApp from "./loyalty/app";

window.refreshBuild = () => {
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

ReactDOM.render(<LoyaltyApp />, document.getElementById("app-container"));
