import useLocalStorage from "./useLocalStorage";

// add key parameter for persistence
const useInput = (key, initialValue) => {
  const [value, setValue] = useLocalStorage(key, initialValue); // for persistence -> useLocalStorage(key, initialValue);

  const reset = () => setValue(initialValue);

  const attributeObj = {
    value,
    onChange: (e) => setValue(e.target.value),
  };

  return [value, reset, attributeObj]; // example -> const [username, resetUsername, usernameAttribute] = useInput("");
};

export default useInput;
