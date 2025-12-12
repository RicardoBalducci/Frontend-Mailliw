import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Dashboard from "./Dashboard";
import { SnackbarProvider } from "../../components/context/SnackbarContext";
import { NotificationsProvider } from "./components/NotificationsContext";

function Dashboards() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <NotificationsProvider>
          <Dashboard />
        </NotificationsProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default Dashboards;
