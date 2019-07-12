import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";

const callback = () => {
  let rowId = 0;
  const incomingMsgContainer = document.querySelector("#incomingMsgs");
  function appendMsg(data, event) {
    const div = document.createElement("div");
    rowId += 1;
    div.innerHTML = `<span>${rowId}: </span><span>${
      event.type
    }, ${JSON.stringify(data)}</span>`;
    incomingMsgContainer.append(div);
  }

  const defaultSize = {
    width: 400,
    height: 600
  };

  const cti = new CallingExtensions({
    debugMode: true,
    eventHandlers: {
      onReady: () => {
        cti.initialized({
          isLoggedIn: true,
          sizeInfo: defaultSize
        });
      },
      onDialNumber: (data, rawEvent) => {
        appendMsg(data, rawEvent);
        cti.outgoingCall();
      },
      onEndCall: () => {
        window.setTimeout(() => {
          cti.callEnded();
        }, 500);
      },
      onVisibilityChanged: (data, rawEvent) => {
        appendMsg(data, rawEvent);
      }
    }
  });

  const element = document.querySelector(".controls");
  element.addEventListener("click", event => {
    const clickedButtonValue = event.target.value;
    switch (clickedButtonValue) {
      case "initialized":
        cti.initialized({
          isLoggedIn: true
        });
        break;
      case "log in":
        cti.userLoggedIn();
        break;
      case "log out":
        cti.userLoggedOut();
        break;
      // Calls
      case "incoming call":
        window.setTimeout(() => {
          cti.incomingCall();
        }, 500);
        break;
      case "outgoing call started":
        window.setTimeout(() => {
          cti.outgoingCall();
        }, 500);
        break;
      case "call answered":
        cti.callAnswered();
        break;
      case "call ended":
        cti.callEnded();
        break;
      case "send error":
        cti.sendError({
          type: Constants.errorType.GENERIC,
          message: "This is a message shown in Hubspot UI"
        });
        break;
      case "change size":
        defaultSize.width += 20;
        defaultSize.height += 20;
        cti.resizeWidget({
          width: defaultSize.width,
          height: defaultSize.height
        });
        break;
      default:
        throw new Error("unknown option");
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
