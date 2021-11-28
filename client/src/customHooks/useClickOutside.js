import { useCallback, useEffect } from "react";

const useClickOutSide = (el, callback) => {
  const handleClick = useCallback(
    (e) => {
      if (el.current) {
        if (el.current.contains(e.target)) {
          callback(true);
        } else {
          callback(false);
        }
      }
    },
    [callback, el]
  );
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [el, callback, handleClick]);
};

export default useClickOutSide;
