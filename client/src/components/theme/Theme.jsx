import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { useMemo } from "react";

export const ThemeWrapper = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: prefersDarkMode ? "#bb86fc" : "#6200ee", // Primary color
          },
          secondary: {
            main: prefersDarkMode ? "#03dac6" : "#03dac6", // Secondary color
          },
          background: {
            default: prefersDarkMode ? "#121212" : "#f5f5f5", // Adjusting the background based on theme
            paper: prefersDarkMode ? "#1d1d1d" : "#ffffff", // Background for paper components
            chat: prefersDarkMode ? "#333333" : "#e0e0e0",
            chat2: prefersDarkMode ? "#444444" : "#cccccc",
            admin: prefersDarkMode ? "#161616" : "#f0f0f0",
          },
          text: {
            primary: prefersDarkMode ? "#ffffff" : "#000000",
            secondary: prefersDarkMode ? "#b0b0b0" : "#333333",
            disabled: prefersDarkMode ? "#757575" : "#bdbdbd",
            hint: prefersDarkMode ? "#8a8a8a" : "#757575",
            bgColor: prefersDarkMode ? "#333333" : "#f5f5f5",
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
