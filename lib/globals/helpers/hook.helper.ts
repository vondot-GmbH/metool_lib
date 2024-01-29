/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

export const useClickedOutside = (ref: any, callback: any): void => {
  useEffect(() => {
    const handleClickOutside = (event: any): void => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};
