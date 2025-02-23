import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Fade,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useUser } from "../providers/user";
import NFTDashboard from "./NFTDashboard";
import NFTPriceTotal from "./NFTPriceTotal";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { react_project_backend } from "../../../declarations/react-project-backend";
import LandLocks from "/LandLocks.png";
import { useRefresh } from "../providers/refresh";

const WalletAddressBox = ({ walletAddress }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <Box
      sx={{
        left: 16,
        bottom: 16,
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        padding: 1,
        borderRadius: 2,
        border: "2px solid #ff9800",
        boxShadow: 3,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          color: "#333",
          fontWeight: "bold",
          textAlign: "left",
          marginBottom: "8px",
        }}
      >
        Wallet Address
      </Typography>
      <Typography
        variant="body1"
        sx={{
          wordBreak: "break-all",
          fontWeight: "bold",
          color: "#333",
          flexGrow: 1,
        }}
      >
        {walletAddress}
      </Typography>
      <Tooltip title="Copy to clipboard">
        <IconButton
          onClick={copyToClipboard}
          sx={{ mt: 1, color: "#ff9800", "&:hover": { color: "#e68900" } }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const HomePage = () => {
  const { walletAddress } = useUser();
  const [showPortfolioText, setShowPortfolioText] = useState(false);
  const [portfolioNFTs, setPortfolioNFTs] = useState([]);
  const portfolioText = "Your Portfolio";
  const { refresh } = useRefresh();

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const userNFTs = await react_project_backend.get_user_nfts(
          walletAddress
        );
        setPortfolioNFTs(userNFTs);
      } catch (err) {
        console.error("Failed to fetch NFTs for total:", err);
      }
    };
    fetchNFTs();
  }, [walletAddress, refresh]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPortfolioText(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        padding: 4,
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Fade in={showPortfolioText} timeout={1000}>
            <Typography
              variant="h4"
              sx={{ mb: 2, fontWeight: "bold", textAlign: "left" }}
            >
              {portfolioText}
            </Typography>
          </Fade>
          <Fade in={showPortfolioText} timeout={1500}>
            <Box>
              <NFTPriceTotal nfts={portfolioNFTs} />
            </Box>
          </Fade>
          <Divider sx={{ my: 2, borderColor: "rgba(0, 0, 0, 0.1)" }} />
          <Fade in={showPortfolioText} timeout={1500}>
            <Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <img
                  src={LandLocks}
                  alt="LandLocks Logo"
                  style={{ maxWidth: "700px", height: "auto" }}
                />
              </Box>
              <WalletAddressBox walletAddress={walletAddress} />
            </Box>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6}>
          <NFTDashboard isSearch={false} walletAddress={walletAddress} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
