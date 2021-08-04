import React from "react";
import { ThemeProvider } from "styled-components";
import WebFont from "webfontloader";
import _ from "lodash";

import { GlobalStyles } from "../theme/GlobalStyles";
import Header from "./shared/header";
import * as DATA from "../theme/schema";
import Routes from "./shared/routes";

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
          <Header />
          <Routes />
        </ThemeProvider>
      </>
    );
  }
}
