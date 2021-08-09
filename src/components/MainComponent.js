import React from "react";
import { ThemeProvider } from "styled-components";
import WebFont from "webfontloader";
import _ from "lodash";

import { GlobalStyles } from "../theme/GlobalStyles";
import * as DATA from "../theme/schema";
import Routes from "./shared/routes";
// eslint-disable-next-line
import Header from './shared/header'
export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: DATA.default.data.light,
    };
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
          {
              window.location.pathname!=='/login' && window.location.pathname!=='/signup' && <Header /> 
          }
          <Routes />
        </ThemeProvider>
      </>
    );
  }
}
