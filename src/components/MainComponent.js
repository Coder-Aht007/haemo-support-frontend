import React from "react";
import { ThemeProvider } from "styled-components";
import WebFont from "webfontloader";
import { Route, Switch, Redirect } from "react-router-dom";
import { GlobalStyles } from "../theme/GlobalStyles";
import Header from "./shared/header";
import Login from "./auth/login";
import Signup from "./auth/signup";
import _ from "lodash";
import * as DATA from '../theme/schema'
import UserUtils from "./shared/user";
import Index from './index'

const isLogin = UserUtils.isLogin;

const PrivateRoute = ({component: Component, ...rest}) => {
  return (
    
      <Route {...rest} render={props => (
          isLogin() ?
              <Component {...props} />
          : <Redirect to="/login" />
      )} />
  );
};

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      theme: DATA.default.data.light
    }
  }

  componentDidMount() {
    const allFonts = _.values(_.mapValues(DATA.default.data, "font"));
    WebFont.load({
      google: {
        families: allFonts,
      },
    });
  }

  
  render() {
    return (
      <>
          <ThemeProvider theme={this.state.theme}>
            <GlobalStyles />
            <Header />
            <div>
              <Switch>
              <PrivateRoute path="/index" component={()=><Index />}  />
              <Route exact path="/login" component={()=><Login />} />
              <Route exact path="/signup" component={()=><Signup />} />
              <Redirect to="/index" />
              </Switch>
            </div>
          </ThemeProvider>

      </>
    );
  }
}
