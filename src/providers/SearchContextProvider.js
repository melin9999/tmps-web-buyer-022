'use client';
import React, { createContext, useContext, useState } from 'react';

export const SearchContext = createContext(null);

export default function SearchContextProvider({children}){
  const [contextDescription, setContextDescription] = useState("");

  return (
    <SearchContext.Provider value={{
      contextDescription,
      setContextDescription,
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearchContext(){
  const context = useContext(SearchContext);
  if(!context){
    throw new Error("Must be used within a ContextProvider");
  }
  return context;
}