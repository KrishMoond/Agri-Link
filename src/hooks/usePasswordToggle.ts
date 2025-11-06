import { useState } from "react";

const usePasswordToggle = () => {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible(!visible);

  return {
    type: visible ? "text" : "password",
    toggleVisibility,
    visible,
  };
};

export default usePasswordToggle;
