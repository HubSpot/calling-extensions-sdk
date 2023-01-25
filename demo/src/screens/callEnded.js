import { formatTime, toggleLogin, getTotalSeconds } from "../outbound";
import { screenIds, showScreen, screenNames } from "./index";

export default function callback() {
  const callEndedScreen = document.querySelector(screenIds.callEnded);
  callEndedScreen.addEventListener("click", event => {
    const clickedButtonId = event.target.id;
    switch (clickedButtonId) {
      case "back":
        showScreen(screenNames.keypad);
        break;
      case "logout":
        toggleLogin();
        showScreen(screenNames.login);
        break;
      default:
        break;
    }
  });

  callEndedScreen.addEventListener("DOMContentLoaded", () => {
    if (getTotalSeconds()) {
      document.querySelector("#callduration").value = `Call Duration ${formatTime(getTotalSeconds())}`;
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
