import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import WebFont from "webfontloader";
import { Route, Switch, Redirect } from "react-router-dom";
import { GlobalStyles } from "../theme/GlobalStyles";
import { useTheme } from "../theme/useTheme";
import Header from "./shared/header";
import Login from './auth/login'
import Signup from './auth/signup'

function App() {
  // 3: Get the selected theme, font list, etc.
  const { theme, themeLoaded, getFonts } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    setSelectedTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeLoaded]);

  // 4: Load all the fonts
  useEffect(() => {
    WebFont.load({
      google: {
        families: getFonts(),
      },
    });
  });

  // 5: Render if the theme is loaded.
  return (
    <>
      {themeLoaded && (
        <ThemeProvider theme={selectedTheme}>
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
      )}
    </>
  );
}

export default App;
