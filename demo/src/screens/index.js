export const login = "login";
export const keypad = "keypad";
export const callActions = "callActions";
export const callEnded = "callEnded";

export const screenNames = { login, keypad, callActions, callEnded };

export const getScreenId = value => `#${value.toLowerCase()}-screen`;
export const screenIds = {
  [login]: getScreenId(login),
  [keypad]: getScreenId(keypad),
  [callActions]: getScreenId(callActions),
  [callEnded]: getScreenId(callEnded)
};

export function showScreen(screen) {
  Object.keys(screenNames).forEach(name => {
    if (name === screen) {
      document.querySelector(getScreenId(name)).classList.remove("hidden");
    } else {
      document.querySelector(getScreenId(name)).classList.add("hidden");
    }
  });
}
