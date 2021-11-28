import { useEffect, useState } from "react";

export default function useWindowResize() {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });

    return window.removeEventListener("resize", () => {});
  }, []);
  return width;
}
