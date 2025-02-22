import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { UserProvider } from "./providers/user";
import LoginComponent from "./components/LoginComponent";
import HomePage from "./components/HomePage";
import ValidateProperty from "./components/validateProperty";
import Transfers from "./pages/transfers";
import { AppBarProvider } from "./providers/navbar";
import AppBarComponent from "./components/appbar";

function App() {
  return (
    <Router>
      <UserProvider>
        <AppBarProvider>
          <AppBarWithLocation />
          <Routes>
            <Route path="/" element={<LoginComponent />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/validate" element={<ValidateProperty />} />
            <Route path="/transfers" element={<Transfers />} />
          </Routes>
        </AppBarProvider>
      </UserProvider>
    </Router>
  );
}

const AppBarWithLocation = () => {
  const location = useLocation();
  return location.pathname !== '/' ? <AppBarComponent /> : null;
};

export default App;
