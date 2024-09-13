import { useEffect } from "react";

const PREFIX = "LocalSettings:Calling:DemoReact";

export default function useLocalStorageState<T>(key: string, value: T) {
  useEffect(() => {
    window.localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(value));

    return () => {
      window.localStorage.removeItem(`${PREFIX}:${key}`);
    };
  }, [key, value]);
}
