function showScreen(idx) {
  for (let i = 0; i <= 3; i += 1) {
    if (i === idx) {
      document.querySelector(`.screen${i}`).classList.remove("hidden");
    } else {
      document.querySelector(`.screen${i}`).classList.add("hidden");
    }
  }
}

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

function isDiaNumberValid(dialNumber) {
  return dialNumber.length > 2;
}

function resetInputFields() {
  document.querySelector("#tonumber").value = "";
  document.querySelector("#fromnumber").value = "";
  document.querySelector("#notes").value = "";
}

const callback = () => {
  const state = {
    callData: {},
    screen: 0,
    toNumber: "+1",
    fromNumber: "",
    isLoggedIn: false,
    cursorPosition: 0,
    numberInputField: null,
    totalSeconds: 0,
    timer: null
  };

  function formatTime(totalSeconds) {
    let hour = Math.floor(totalSeconds / 3600);
    let minute = Math.floor((totalSeconds - hour * 3600) / 60);
    let seconds = totalSeconds - (hour * 3600 + minute * 60);
    if (hour < 10) { hour = `0${hour}`; }
    if (minute < 10) { minute = `0${minute}`; }
    if (seconds < 10) { seconds = `0${seconds}`; }
    return `${hour}:${minute}:${seconds}`;
  }

  function countTimer() {
    state.totalSeconds += 1;
    document.querySelector("#timer").innerHTML = formatTime(state.totalSeconds);
  }

  const loginScreen = document.querySelector(".screen0");
  loginScreen.addEventListener("click", event => {
    const clickedButtonId = event.target.id;
    if (clickedButtonId === "login") {
      state.isLoggedIn = true;
      state.screen = 1;
      showScreen(state.screen);
      document.querySelector("#tonumber").focus();
      document.querySelector("#tonumber").value = state.toNumber;
    }
  });

  document.querySelector("#tonumber").addEventListener("blur", function(_e) {
    state.cursorPosition = this.selectionEnd;
  });
  document.querySelector("#tonumber").addEventListener("click", function(_e) {
    state.numberInputField = this;
  });
  document.querySelector("#fromnumber").addEventListener("click", function(_e) {
    state.numberInputField = this;
  });

  document.querySelector(".keypadheader").addEventListener("click", event => {
    const clickedButtonId = event.target.id;
    const dialNumberVal = document.querySelector("#tonumber").value;
    if (clickedButtonId === "backspace" && state.cursorPosition >= 1) {
      document.querySelector("#tonumber").value = dialNumberVal.substring(0, state.cursorPosition - 1) + dialNumberVal.substring(state.cursorPosition);
      document.querySelector("#tonumber").setSelectionRange(state.cursorPosition - 1, state.cursorPosition - 1);
    }
    document.querySelector("#tonumber").focus();
  });

  const keys = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "#"]);
  const keypad = document.querySelector(".keypad");
  keypad.addEventListener("keypress", event => {
    if (!isNaN(event.key) || event.key === "+") {
      return event;
    }
    event.preventDefault();
  });
  keypad.addEventListener("click", event => {
    const clickedButtonId = event.target.id;

    const numberInputField = state.numberInputField ? state.numberInputField : document.querySelector("#tonumber");
    if (keys.has(clickedButtonId)) {
      numberInputField.value += clickedButtonId;
    } else if (clickedButtonId === "startcall") {
      if (isDiaNumberValid(document.querySelector("#tonumber").value) && isDiaNumberValid(document.querySelector("#fromnumber").value)) {
        state.callData = {
          fromNumber: document.querySelector("#fromNumber").value,
          toNumber: document.querySelector("#toNumber").value
        };
        showScreen(2);
        state.timer = setInterval(countTimer, 1000);
      }
      document.querySelector("#tonumberdisplay").textContent = state.callData.toNumber;
      return;
    }
    numberInputField.focus();
  });

  const endCallScreen = document.querySelector(".screen2");
  endCallScreen.addEventListener("click", event => {
    const clickedButtonId = event.target.id;
    const clickedButtonValue = event.target.value;

    if (keys.has(clickedButtonValue)) {
      document.querySelector("#callingkeypadnumber").value += clickedButtonValue;
    }

    switch (clickedButtonId) {
      case "endcall":
        // TODO: Update call data
        state.notes = document.querySelector("#callingnotes").value;
        if (state.totalSeconds) {
          document.querySelector("#callduration").innerHTML = `Call Duration ${formatTime(state.totalSeconds)}`;
        }
        clearInterval(state.timer);
        resetInputFields();
        showScreen(3);
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

  const callEndedScreen = document.querySelector(".screen3");
  callEndedScreen.addEventListener("click", event => {
    const clickedButtonId = event.target.id;
    switch (clickedButtonId) {
      case "back":
        showScreen(1);
        break;
      case "logout":
        state.isLoggedIn = false;
        showScreen(0);
        break;
      default:
        break;
    }
  });

  callEndedScreen.addEventListener("DOMContentLoaded", () => {
    if (state.totalSeconds) {
      document.querySelector("#callduration").value = `Call Duration ${formatTime(state.totalSeconds)}`;
    }
  });
};

if (
  document.readyState === "interactive" ||
  document.readyState === "complete"
) {
  window.setTimeout(() => callback(), 1000);
} else {
  document.addEventListener("DOMContentLoaded", callback);
}
