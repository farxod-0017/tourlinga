import { createContext, useContext } from "react";

export const DirecsContext = createContext(null);

export const useDirecs = () => useContext(DirecsContext);
