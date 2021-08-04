import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Login from "../auth/login";
import Signup from "../auth/signup";
import Index from "../index";
import UserUtils from "../shared/user";

const isLogin = UserUtils.isLogin;

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const Routes = () => (
  <Switch>
    <PrivateRoute path="/index" component={() => <Index />} />
    <Route exact path="/login" render={() => <Login />} />
    <Route exact path="/signup" render={() => <Signup />} />
    <Redirect to="/index" />
  </Switch>
);

export default Routes;
