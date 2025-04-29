import React from "react";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "./store";

// Typed versions of useSelector and useDispatch
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useDebounce = (value: any, delay: number) => {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
