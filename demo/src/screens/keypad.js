import { keys, startTimer, getState, setState } from "../outbound";
import { showScreen, screenNames } from "./index";

const localState = {
  cursorPosition: 0,
};

function isDiaNumberValid() {
  return true;
}

export default function callback() {
  document.querySelector("#tonumber").addEventListener("blur", function(_e) {
    localState.cursorPosition = this.selectionEnd;
  });

  document.querySelector(".keypadheader").addEventListener("click", event => {
    const clickedButtonId = event.target.id;
    if (clickedButtonId === "backspace") {
      const toNumberVal = document.querySelector("#tonumber").value;
      document.querySelector("#tonumber").value = toNumberVal.substring(0, localState.cursorPosition - 1) + toNumberVal.substring(localState.cursorPosition);
      document.querySelector("#tonumber").setSelectionRange(localState.cursorPosition - 1, localState.cursorPosition - 1);
      setState({ toNumber: document.querySelector("#tonumber").value });
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

    if (keys.has(clickedButtonId)) {
      const curr = getState().toNumber;
      setState({toNumber: curr + clickedButtonId})
      document.querySelector("#toNumber").value = curr + clickedButtonId;
    } else if (clickedButtonId === "startcall") {
      if (isDiaNumberValid()) {
        window.cti.outgoingCall({
          createEngagement: "true",
          phoneNumber: document.querySelector("#toNumber").value
        });
        showScreen(screenNames.callActions);
        startTimer();
      }
      document.querySelector("#tonumberdisplay").textContent = document.querySelector("#toNumber").value;
      return;
    }
    document.querySelector("#tonumber").focus();
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

console.log('keypad')
