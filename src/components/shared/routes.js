import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Login from "../auth/login";
import Signup from "../auth/signup";
import Index from "../Dashboard/index";
import { UserUtils } from "../shared/user";
import Profile from "../profile/profile";
import Requests from "../UserRequests/requests";
import AddBulkUsers from "../AddBulkUser/index";
import SetPassword from "../auth/SetPassword";

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
    <Route exact path="/login" render={(props) => <Login {...props} />} />
    <Route exact path="/signup" render={(props) => <Signup {...props} />} />
    <Route
      exact
      path="/set-password/"
      render={(props) => <SetPassword {...props} />}
    />
    <PrivateRoute
      exact
      path="/index"
      component={(props) => <Index {...props} />}
    />
    <PrivateRoute
      exact
      path="/profile"
      component={(props) => <Profile {...props} />}
    />
    <PrivateRoute
      exact
      path="/requests"
      component={(props) => <Requests {...props} />}
    />
    <PrivateRoute
      exact
      path="/addusers"
      component={(props) => <AddBulkUsers {...props} />}
    />
    <Redirect to="/login" />
  </Switch>
);

export default Routes;
