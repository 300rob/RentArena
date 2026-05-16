import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const tokens = (mode) => ({
  white: {
    100: "#ffffff",
    200: "#f9f9f9",
    300: "#f0f0f0",
    400: "#e5e5e5",
    500: "#808080",
    600: "#404040",
    700: "#262626",
    800: "#1a1a1a",
    900: "#000000",
  },
  custom: {
    50: "#ffffff",
    100: "#f9f9f9",
    200: "#f0f0f0",
    300: "#e5e5e5",
    400: "#d0d0d0",
    500: "#808080",
    600: "#404040",
    700: "#262626",
    800: "#1a1a1a",
    900: "#000000",
    950: "#000000",
  },
});

export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      primary: {
        main: "#000000",
      },
      secondary: {
        main: "#808080",
      },
      neutral: {
        dark: colors.white[700],
        main: colors.white[500],
        light: colors.white[100],
      },
      background: {
        default: '#ffffff'
      },
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};