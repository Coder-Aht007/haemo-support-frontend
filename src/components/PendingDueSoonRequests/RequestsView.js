import React, { useState } from "react";

import { Redirect } from "react-router";

import { RequestContextProvider } from "./RequestsContext";
import { RequestsDisplay } from "./RequestsDisplay";

import { UserUtils } from "../shared/user";

const RequestsView = () => {
  const [isAdmin] = useState(UserUtils.isAdmin());

  return (
    <RequestContextProvider>
      {!isAdmin && <Redirect to="/index" />}
      <RequestsDisplay /> 
    </RequestContextProvider>
  );
};

export default RequestsView;
