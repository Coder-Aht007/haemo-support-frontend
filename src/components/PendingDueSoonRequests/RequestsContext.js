import React, { useState, createContext } from "react";

export const RequestsContext = createContext();

export const RequestContextProvider = (props) => {
  const [requests, setRequests] = useState([]);

  return (
    <RequestsContext.Provider value={[requests, setRequests]}>
      {props.children}
    </RequestsContext.Provider>
  );
};
