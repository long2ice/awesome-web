import Index from "./views";
import Repo from "./views/repo";
import { Route, Routes } from "react-router-dom";
import {
  Box,
  createTheme,
  CssBaseline,
  IconButton,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { useMemo, useState } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Footer from "./components/footer";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          background: {
            default: mode === "dark" ? "#121212" : "#F2F6FC",
          },
        },
      }),
    [prefersDarkMode, mode]
  );
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Box display="flex">
          <IconButton
            sx={{ ml: "auto", mr: 2, mt: 2 }}
            onClick={() =>
              setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
            }
            color="inherit"
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Box>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/repo" element={<Repo />} />
        </Routes>
        <Footer mt="auto" />
      </Box>
    </ThemeProvider>
  );
}

export default App;
