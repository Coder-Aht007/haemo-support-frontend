import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import WebFont from "webfontloader";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { GlobalStyles } from "./theme/GlobalStyles";
import { useTheme } from "./theme/useTheme";

// 2: Create a cotainer
const Container = styled.div`
  margin: 15px 15px 15px 15px;
`;

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
          <Container style={{ fontFamily: selectedTheme.font }}>
            <BrowserRouter>
              <Switch>
                <Route path="/index">
                  hello
                </Route>
                <Route path="/some">
                  hello again
                </Route>
                <Route path="/some2">
                  hello again again
                </Route>
                <Redirect exact from="/" to="/index" />
              </Switch>
            </BrowserRouter>
          </Container>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;