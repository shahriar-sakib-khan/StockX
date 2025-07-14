import useLocalStorage from "./useLocalStorage";

// add key parameter for persistence
const useToggle = (key, initialValue) => {
  const [value, setValue] = useLocalStorage(key, initialValue); // for persistence -> useLocalStorage(key, initialValue);

  const toggle = (value) => {
    setValue((prev) => {
      return typeof value === "boolean" ? value : !prev;
    });
  };

  return [value, toggle]; // example -> const [checkbox, toggleCheckbox] = useToggle(false);
};

export default useToggle;
