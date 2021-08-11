import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Login from "../auth/login";
import Signup from "../auth/signup";
import Index from "../index";
import { UserUtils } from "../shared/user";
import Profile from "../profile/profile";
import Header from "../shared/header";

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
    <Route exact path="/">
      <Redirect to="/login" />
    </Route>
    <Route exact path="/login" render={() => <Login />} />
    <Route exact path="/signup" render={() => <Signup />} />
    <>
      <Header />
      <PrivateRoute exact path="/index" component={() => <Index />} />
      <PrivateRoute exact path="/profile" component={() => <Profile />} />
    </>
    <Redirect to="/login" />
  </Switch>
);

export default Routes;
