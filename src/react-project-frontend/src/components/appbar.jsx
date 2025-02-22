import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useAppBar } from "../providers/navbar";
import { useNavigate } from "react-router-dom";

const AppBarComponent = () => {
  const { isWalletConnected, connectWallet, disconnectWallet } = useAppBar();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isWalletConnected) {
      disconnectWallet();
      navigate("/"); // Redirect to the home page or login page after logout
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          onClick={() => navigate("/Home")}
        >
          LandLocks
        </Typography>
        <Button
          sx={{
            color: "#fff",
            backgroundColor: "orange",
            "&:hover": {
              backgroundColor: "#ff9800", // Darker shade of orange for hover
            },
          }}
          onClick={() => navigate("/transfers")}
        >
          Search
        </Button>
        <Button
          sx={{
            color: "#fff",
            backgroundColor: "orange",
            ml: 1,
            "&:hover": {
              backgroundColor: "#ff9800",
            },
          }}
          onClick={() => navigate("/validate")}
        >
          Create
        </Button>

        <Button
          color="inherit"
          variant="outlined"
          sx={{ ml: 2 }}
          onClick={isWalletConnected ? handleLogout : connectWallet}
        >
          {isWalletConnected ? "Logout" : "Login"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
