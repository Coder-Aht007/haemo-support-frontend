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

  
function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

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
    const authed = UserUtils.getName() !=null
    return (
      <>
          <ThemeProvider theme={this.state.theme}>
            <GlobalStyles />
            <Header />
            <div>
              <Switch>
              <PrivateRoute authed={authed} exact path="/index" component={()=><Index />}  />
              <Route exact path="/login" component={()=><Login />} />
              <Route exact path="/signup" component={()=><Signup />} />
              <Redirect exact from="/" to="/index" />
              </Switch>
            </div>
          </ThemeProvider>

      </>
    );
  }
}
