export const LOCAL_SETTINGS_PREFIX = "LocalSettings:Calling:";

function getPrefixedKey(key: string, prefix: string) {
  return `${prefix}${key}`;
}

export function deleteSetting(key: string, prefix = LOCAL_SETTINGS_PREFIX) {
  if (!window.localStorage) {
    return;
  }

  try {
    window.localStorage.removeItem(getPrefixedKey(key, prefix));
  } catch (error) {
    console.log("Removing item from localstorage failed", {
      error: error as Error,
      level: "info",
    });
  }
}

export function setSetting(
  key: string,
  value: unknown,
  prefix = LOCAL_SETTINGS_PREFIX
) {
  if (!window.localStorage) {
    return undefined;
  }

  try {
    const val = typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(getPrefixedKey(key, prefix), val);
    return value;
  } catch (error) {
    console.log("Unable to setSetting to LocalStorage", {
      error: error as Error,
      level: "info",
    });
    return undefined;
  }
}

export function getSetting(
  key: string,
  fallback?: any,
  parser?: Function,
  prefix = LOCAL_SETTINGS_PREFIX
) {
  if (!window.localStorage) {
    return fallback;
  }

  const setFallback = () => {
    if (fallback) {
      setSetting(key, fallback);
    }
  };

  let entry;
  try {
    entry = window.localStorage.getItem(getPrefixedKey(key, prefix));
    if (!entry || entry === "null" || entry === "undefined") {
      setFallback();
      return fallback;
    }

    if (entry.startsWith("{")) {
      const result = JSON.parse(entry);
      return typeof parser === "function" ? parser(result) : result;
    }

    return entry;
  } catch (error) {
    setFallback();
    let errorMessage =
      "Unable to getSetting from LocalStorage, using fallback if available.";
    if (error instanceof Error && "message" in error) {
      const temp = errorMessage;
      errorMessage = error.message;
      error.message = temp;
    }
    console.log(errorMessage, {
      extra: { entry: entry || "", fallback },
      level: "info",
    });
    return fallback;
  }
}
