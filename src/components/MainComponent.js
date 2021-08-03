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
                <Route path="/index">hello</Route>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/signup">
                  <Signup />
                </Route>
                <Redirect exact from="/" to="/index" />
              </Switch>
            </div>
          </ThemeProvider>

      </>
    );
  }
}
