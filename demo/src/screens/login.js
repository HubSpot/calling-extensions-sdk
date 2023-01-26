import { setState, getState } from "../outbound";
import { screenIds, showScreen, screenNames } from "./index";

function toggleLogin(value) {
  if (value === "login") {
    document.querySelector("#login").classList.add("hidden");
    document.querySelector("#logout").classList.remove("hidden");
  } else {
    document.querySelector("#login").classList.remove("hidden");
    document.querySelector("#logout").classList.add("hidden");
  }
}


export default function callback() {
  const loginScreen = document.querySelector(screenIds.login);
  loginScreen.addEventListener("click", event => {
    const clickedButtonId = event.target.id;
    if (clickedButtonId === "login") {
      window.cti.userLoggedIn();
      setState({ isLoggedIn: true });
      toggleLogin(clickedButtonId);
    }

    if (clickedButtonId === 'logout') {
      window.cti.userLoggedOut();
      setState({ isLoggedIn: false });
      toggleLogin(clickedButtonId);
    }

    if (clickedButtonId === "gotokeypad") {
      if (!getState().isLoggedIn) {
        window.cti.sendError({
          type: "GENERIC",
          message: "You are not logged in"
        });
        return;
      }
      showScreen(screenNames.keypad);
      document.querySelector("#tonumber").focus();
      document.querySelector("#tonumber").value = getState().toNumber;
      document.querySelector("#fromnumber").value = getState().fromNumber;
    }
    if (clickedButtonId === "updatemessages") {
      let messages = document.createElement("div");
      messages.id = "incoming-msgs";

      getState().messages.forEach(message => {
        const { messageId, type } = message;
        let title = document.createElement("li");
        title.classList.add("collapsible");
        title.id = messageId;
        title.innerText = type;

        let body = document.createElement("div");
        body.classList.add(messageId)
        body.innerText = JSON.stringify(message);

        messages.appendChild(title);
        messages.appendChild(body);
      })

      const incomingMsgContainer = document.querySelector("#incoming-msgs");
      incomingMsgContainer.replaceWith(messages);

      document.querySelectorAll(".collapsible").forEach(collapsible => {
        collapsible.addEventListener("click", event => {
          const messageBody = document.getElementsByClassName(event.target.id)[0];
          if (messageBody.classList.contains("hidden")) {
            messageBody.classList.remove("hidden")
          } else {
            messageBody.classList.add("hidden")
          }
        })
      })
    }
  });
}

if (
  document.readyState === "interactive" ||
  document.readyState === "complete"
) {
  window.setTimeout(() => callback(), 500);
} else {
  document.addEventListener("DOMContentLoaded", callback);
}

console.log('login')
