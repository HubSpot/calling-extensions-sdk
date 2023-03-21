import { useRef, useEffect } from "react";

export const useAutoFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return inputRef;
};
