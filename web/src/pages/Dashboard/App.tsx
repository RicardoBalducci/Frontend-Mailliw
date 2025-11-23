import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Dashboard from "./Dashboard";
import { SnackbarProvider } from "../../components/context/SnackbarContext";

function Dashboards() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <Dashboard />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default Dashboards;
