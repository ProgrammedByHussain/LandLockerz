import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
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
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate("/Home")}
            sx={{ cursor: "pointer" }}
          >
            LandLocks
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 2,
              backgroundColor: "rgba(255,255,255,0.5)",
              height: "60px",
              alignSelf: "center",
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.7)", mr: 1 }}
            >
              Powered By
            </Typography>
            <a
              href="https://internetcomputer.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/ICP.png"
                alt="Infinity Logo"
                style={{ height: "60px", width: "60px" }}
              />
            </a>
          </Box>
        </Box>
        <Button
          sx={{
            color: "#fff",
            backgroundColor: "orange",
            "&:hover": {
              backgroundColor: "#ff9800",
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
