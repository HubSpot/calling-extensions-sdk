import { keys, startTimer, setCallData } from "../outbound";
import { showScreen, screenNames } from "./index";

const localState = {
  cursorPosition: 0,
  numberInputField: null
};

function isDiaNumberValid() {
  return true;
}

export default function callback() {
  document.querySelector("#tonumber").addEventListener("blur", function(_e) {
    localState.cursorPosition = this.selectionEnd;
  });
  document.querySelector("#tonumber").addEventListener("click", function(_e) {
    localState.numberInputField = this;
  });
  document.querySelector("#fromnumber").addEventListener("click", function(_e) {
    localState.numberInputField = this;
  });

  document.querySelector(".keypadheader").addEventListener("click", event => {
    const clickedButtonId = event.target.id;
    const dialNumberVal = document.querySelector("#tonumber").value;
    if (clickedButtonId === "backspace" && localState.cursorPosition >= 1) {
      document.querySelector("#tonumber").value = dialNumberVal.substring(0, state.cursorPosition - 1) + dialNumberVal.substring(state.cursorPosition);
      document.querySelector("#tonumber").setSelectionRange(localState.cursorPosition - 1, state.cursorPosition - 1);
    }
    document.querySelector("#tonumber").focus();
  });

  const keypad = document.querySelector(".keypad");
  keypad.addEventListener("keypress", event => {
    if (!isNaN(event.key) || event.key === "+") {
      return event;
    }
    event.preventDefault();
  });
  keypad.addEventListener("click", event => {
    const clickedButtonId = event.target.id;

    const numberInputField = localState.numberInputField ? localState.numberInputField : document.querySelector("#tonumber");
    if (keys.has(clickedButtonId)) {
      numberInputField.value += clickedButtonId;
    } else if (clickedButtonId === "startcall") {
      if (isDiaNumberValid()) {
        setCallData({
          fromNumber: document.querySelector("#fromNumber").value,
          toNumber: document.querySelector("#toNumber").value
        });
        showScreen(screenNames.callActions);
        startTimer();
      }
      document.querySelector("#tonumberdisplay").textContent = document.querySelector("#toNumber").value;
      return;
    }
    numberInputField.focus();
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
