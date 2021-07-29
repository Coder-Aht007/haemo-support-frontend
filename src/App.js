import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import WebFont from "webfontloader";
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
            <h1>Hello World</h1>
            <p>For Exciting Projects</p>
            <a href="http://github.com/Coder-Aht007/" target="_blank">
              Click here.
            </a>
          </Container>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;
