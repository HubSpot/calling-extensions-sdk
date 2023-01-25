import { toggleLogin } from "../outbound";
import { screenIds, showScreen, screenNames } from "./index";

export default function callback() {
  const loginScreen = document.querySelector(screenIds.login);
  loginScreen.addEventListener("click", event => {
    const clickedButtonId = event.target.id;
    if (clickedButtonId === "login") {
      toggleLogin();
      showScreen(screenNames.keypad);
      document.querySelector("#tonumber").focus();
      document.querySelector("#tonumber").value = window.state.toNumber;
    }
  });
}

if (
  document.readyState === "interactive" ||
  document.readyState === "complete"
) {
  window.setTimeout(() => callback(), 1000);
} else {
  document.addEventListener("DOMContentLoaded", callback);
}
