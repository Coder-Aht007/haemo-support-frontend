import { useEffect, useState } from 'react';
import { setToLS, getFromLS } from '../utils/storage';
import _ from 'lodash';

export const useTheme = () => {
  const themes = getFromLS('my-themes');
  const [theme, setTheme] = useState(themes.data.light);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const setMode = mode => {
    setToLS('theme', mode)
    setTheme(mode);
  };

  const getFonts = () => {
    const allFonts = _.values(_.mapValues(themes.data, 'font'));
    return allFonts;
  }

  useEffect(() =>{
    const localTheme = getFromLS('theme');
    localTheme ? setTheme(localTheme) : setTheme(themes.data.dark);
    setThemeLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { theme, themeLoaded, setMode, getFonts };
};