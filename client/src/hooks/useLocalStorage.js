import { useEffect, useState } from "react";

const getLocalValue = (key, initialValue) => {
  // SSR (e.g. Next.js)
  if (typeof window === "undefined") return initialValue;

  // if a value is already stored
  const item = localStorage.getItem(key);
  if (item !== null && item !== undefined) return JSON.parse(item);

  // return result of a function
  if (initialValue instanceof Function) return initialValue();

  return initialValue;
};

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return getLocalValue(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;

// for the SSR in nextjs, when during hydration, the input value rendered on the server side should match to the value on the client side.
// If different (because of missing localStorage), the nextjs will not happy and an error popup shown.
// It may be fixed by placing useEffect hook to load value from localStorage,
// so the value always be initialValue and after hydration the useEffect will replace the initalValue with the value from localStorage.
