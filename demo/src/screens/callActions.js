import { keys, formatTime, clearTimer, getTotalSeconds } from "../outbound";
import { screenIds, showScreen, screenNames } from "./index";

function toggleKeypad(value) {
  if (value === "keypad") {
    document.querySelector("#callingkeypad").classList.remove("hidden");
    document.querySelector("#callingnotes").classList.add("hidden");
  } else {
    document.querySelector("#callingkeypad").classList.add("hidden");
    document.querySelector("#callingnotes").classList.remove("hidden");
  }
}

function toggleMute(value) {
  if (value === "mute") {
    document.querySelector("#mute").classList.add("hidden");
    document.querySelector("#unmute").classList.remove("hidden");
  } else {
    document.querySelector("#unmute").classList.add("hidden");
    document.querySelector("#mute").classList.remove("hidden");
  }
}

function toggleRecord(value) {
  if (value === "record") {
    document.querySelector("#record").classList.add("hidden");
    document.querySelector("#stoprecord").classList.remove("hidden");
  } else {
    document.querySelector("#stoprecord").classList.add("hidden");
    document.querySelector("#record").classList.remove("hidden");
  }
}

function resetInputFields() {
  document.querySelector("#tonumber").value = "";
  document.querySelector("#fromnumber").value = "";
  document.querySelector("#notes").value = "";
}

export default function callback() {
  const endCallScreen = document.querySelector(screenIds.callActions);
  endCallScreen.addEventListener("click", event => {
    const clickedButtonId = event.target.id;
    const clickedButtonValue = event.target.value;

    if (keys.has(clickedButtonValue)) {
      document.querySelector("#callingkeypadnumber").value += clickedButtonValue;
    }

    switch (clickedButtonId) {
      case "endcall":
        // TODO: Update call data
        if (getTotalSeconds()) {
          document.querySelector("#callduration").innerHTML = `Call Duration ${formatTime(getTotalSeconds())}`;
        }
        clearTimer();
        resetInputFields();
        showScreen(screenNames.callEnded);
        break;
      case "keypad":
      case "notes":
        toggleKeypad(clickedButtonId);
        break;
      case "mute":
      case "unmute":
        toggleMute(clickedButtonId);
        break;
      case "record":
      case "stoprecord":
        toggleRecord(clickedButtonId);
        break;
      default:
        break;
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
