import React, { useState, useEffect, memo } from "react";
import { react_project_backend } from "../../../declarations/react-project-backend";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// Separate TransferDialog into a memoized component
const TransferDialog = memo(
  ({ open, onClose, onTransfer, transferAddress, setTransferAddress }) => {
    const handleInputChange = (e) => {
      setTransferAddress(e.target.value);
    };

    return (
      <Dialog
        open={open}
        onClose={onClose}
        TransitionProps={{
          unmountOnExit: false,
        }}
      >
        <DialogTitle>
          Transfer NFT
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Recipient Address"
            fullWidth
            value={transferAddress}
            onChange={handleInputChange}
            autoComplete="off"
            InputProps={{
              autoFocus: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onTransfer} variant="contained" color="warning">
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

const NFTDashboard = ({ isSearch, walletAddress }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [transferAddress, setTransferAddress] = useState("");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  const CARDS_PER_ROW = 3;
  const MIN_CARDS = 6;

  // Card style constants
  const CARD_STYLES = {
    height: 300, // Fixed height for all cards
    display: "flex",
    flexDirection: "column",
  };

  const CONTENT_STYLES = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  const DESCRIPTION_STYLES = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    flex: 1,
  };

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const userNFTs = await react_project_backend.get_user_nfts(walletAddress);
      setNfts(userNFTs);
    } catch (err) {
      setError("Failed to fetch NFTs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  const handleOpenTransferDialog = (nft) => {
    setSelectedNFT(nft);
    setTransferDialogOpen(true);
  };

  const handleCloseTransferDialog = () => {
    setTransferDialogOpen(false);
    setTransferAddress("");
  };

  const handleTransfer = async () => {
    if (!transferAddress) {
      setError("Please enter a transfer address");
      return;
    }
    try {
      const success = await react_project_backend.transfer_nft(
        selectedNFT.id,
        transferAddress
      );
      if (success) {
        setTransferDialogOpen(false);
        setTransferAddress("");
        fetchNFTs();
      } else {
        setError("Transfer failed");
      }
    } catch (err) {
      setError("Transfer failed: " + err.message);
    }
  };

  const handleDownload = (nftTitle) => {
    const fileData = localStorage.getItem(nftTitle);
    if (fileData) {
      const blob = new Blob(
        [
          new Uint8Array(
            atob(fileData)
              .split("")
              .map((c) => c.charCodeAt(0))
          ),
        ],
        { type: "application/pdf" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nftTitle + ".pdf";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert("File not found in local storage");
    }
  };

  const TemplateCard = () => (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        elevation={3}
        sx={{
          ...CARD_STYLES,
          opacity: 0.5,
          backgroundColor: "#f5f5f5",
          border: "2px dashed #ccc",
        }}
      >
        <CardContent sx={CONTENT_STYLES}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Available Slot
            </Typography>
          </Box>
          <Typography color="textSecondary" gutterBottom>
            Category
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="body2"
            paragraph
            color="textSecondary"
            sx={DESCRIPTION_STYLES}
          >
            This slot is available for your next NFT
          </Typography>
          <Grid container spacing={2} sx={{ mt: "auto" }}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Price
              </Typography>
              <Typography variant="body2">--</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Location
              </Typography>
              <Typography variant="body2">--</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderNFTCard = (nft) => (
    <Grid item xs={12} sm={6} md={4} key={nft.id.toString()}>
      <Card elevation={3} sx={CARD_STYLES}>
        <CardContent sx={CONTENT_STYLES}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "80%",
              }}
            >
              {nft.metadata.title}
            </Typography>
            {nft.metadata.file_name && (
              <IconButton
                onClick={() => handleDownload(nft.metadata.title)}
                sx={{ color: "red" }}
              >
                <PictureAsPdfIcon />
              </IconButton>
            )}
          </Box>
          <Typography
            color="textSecondary"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {nft.metadata.category}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" sx={DESCRIPTION_STYLES}>
            {nft.metadata.description}
          </Typography>
          <Grid container spacing={2} sx={{ mt: "auto" }}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Price
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {nft.metadata.price}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Location
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {nft.metadata.location}
              </Typography>
            </Grid>
          </Grid>
          {!isSearch && (
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              startIcon={<TransferWithinAStationIcon />}
              color="warning"
              onClick={() => handleOpenTransferDialog(nft)}
            >
              Transfer NFT
            </Button>
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      );
    }

    if (nfts.length === 0 && !isSearch) {
      return (
        <Grid container spacing={3}>
          {[...Array(MIN_CARDS)].map((_, index) => (
            <TemplateCard key={`template-${index}`} />
          ))}
        </Grid>
      );
    }

    // Only calculate template count if not in search mode
    const templateCount = !isSearch
      ? Math.max(
          MIN_CARDS - nfts.length,
          CARDS_PER_ROW - (nfts.length % CARDS_PER_ROW)
        )
      : 0;

    return (
      <Grid container spacing={3}>
        {nfts.map(renderNFTCard)}
        {!isSearch &&
          [...Array(templateCount)].map((_, index) => (
            <TemplateCard key={`template-${index}`} />
          ))}
      </Grid>
    );
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {renderContent()}
      <TransferDialog
        open={transferDialogOpen}
        onClose={handleCloseTransferDialog}
        onTransfer={handleTransfer}
        transferAddress={transferAddress}
        setTransferAddress={setTransferAddress}
      />
    </Box>
  );
};

export default NFTDashboard;
