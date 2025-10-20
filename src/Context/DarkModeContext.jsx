import { createContext, useContext, useEffect, useState, useCallback } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('darkMode');
      return stored === 'true';
    } catch (e) {
      return false;
    }
  });

  // Toggle with a brief transition class so the theme swap looks smooth
  const setTheme = useCallback((next) => {
    const html = document.documentElement;
    // add transition helper
    html.classList.add('theme-transition');
    // apply theme
    if (next) html.classList.add('dark'); else html.classList.remove('dark');
    try { localStorage.setItem('darkMode', next ? 'true' : 'false'); } catch(e){}
    setDarkMode(next);
    // remove transition helper shortly after
    window.setTimeout(() => html.classList.remove('theme-transition'), 300);
  }, []);

  useEffect(() => {
    // ensure DOM has initial theme class (index.html script already handles this for quick paint)
    const html = document.documentElement;
    if (darkMode) html.classList.add('dark'); else html.classList.remove('dark');
  }, []);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode: setTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
