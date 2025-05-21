import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { LoginPage } from "./pages/Login/LoginPage";
import { UserProvider } from "./pages/Login/hooks/userContext";
import Dashboards from "./pages/Dashboard/App";

function App() {
  return (
    <>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboards />} />
          </Routes>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
