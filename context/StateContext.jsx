"use client";
import { createContext, useReducer, useContext } from "react";
import reducer, { initialState } from "./StateReducers";
export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  ); 
};

export const useGlobalContext=()=> useContext(GlobalContext);


