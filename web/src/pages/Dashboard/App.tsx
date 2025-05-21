import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Dashboard from "./Dashboard";

function Dashboards() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  );
}

export default Dashboards;
