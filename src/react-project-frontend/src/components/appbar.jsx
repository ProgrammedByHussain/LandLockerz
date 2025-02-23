import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useAppBar } from "../providers/navbar";
import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { useUser } from "../providers/user";

const AppBarComponent = () => {
  const { isWalletConnected, connectWallet, disconnectWallet } = useAppBar();
  const navigate = useNavigate();
  const { walletAddress } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log(isWalletConnected);
        if (walletAddress !== "") {
          console.log("teast");
          connectWallet();
        } else {
          disconnectWallet();
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    if (isWalletConnected) {
      try {
        const authClient = await AuthClient.create();
        if (authClient.isAuthenticated()) {
          await authClient.logout();
        }
        disconnectWallet();
        navigate("/");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              component="div"
              onClick={() => navigate("/Home")}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              LandLocks
              <LockIcon sx={{ ml: 1, fontSize: "1.2rem" }} />
            </Typography>
          </Box>
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
          onClick={() => navigate("/search")}
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
          onClick={isWalletConnected ? handleLogout : handleLogin}
        >
          {isWalletConnected ? "Logout" : "Login"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
