import React, { useState, useEffect } from "react";
import { react_project_backend } from "../../../declarations/react-project-backend";
import { useUser } from "../providers/user";
import { Grid, Card, CardContent, Typography, Divider, Box, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField } from "@mui/material";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // PDF Icon

const NFTDashboard = () => {
  const { walletAddress } = useUser();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [transferAddress, setTransferAddress] = useState("");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  // Fetch NFTs
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
      const success = await react_project_backend.transfer_nft(selectedNFT.id, transferAddress);
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

  // Handle download from local storage
  const handleDownload = (nftTitle) => {
    const fileData = localStorage.getItem(nftTitle);
    if (fileData) {
      const blob = new Blob([new Uint8Array(atob(fileData).split("").map(c => c.charCodeAt(0)))], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nftTitle + '.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert('File not found in local storage');
    }
  };

  const TransferDialog = () => (
    <Dialog open={transferDialogOpen} onClose={handleCloseTransferDialog}>
      <DialogTitle>
        Transfer NFT
        <IconButton onClick={handleCloseTransferDialog} sx={{ position: "absolute", right: 8, top: 8 }}>
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
          onChange={(e) => setTransferAddress(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseTransferDialog}>Cancel</Button>
        <Button onClick={handleTransfer} variant="contained" color="warning"> {/* Orange Transfer Button */}
          Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {nfts.length > 0 ? (
            nfts.map((nft) => (
              <Grid item xs={12} sm={6} md={4} key={nft.id.toString()}>
                <Card elevation={3}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" gutterBottom>
                        {nft.metadata.title}
                      </Typography>

                      {/* PDF Download Icon */}
                      {nft.metadata.file_name && (
                        <IconButton
                          onClick={() => handleDownload(nft.metadata.title)}
                          sx={{ color: "red" }}
                        >
                          <PictureAsPdfIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Typography color="textSecondary" gutterBottom>
                      {nft.metadata.category}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" paragraph>{nft.metadata.description}</Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Price</Typography>
                        <Typography variant="body2">{nft.metadata.price}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                        <Typography variant="body2">{nft.metadata.location}</Typography>
                      </Grid>
                    </Grid>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      startIcon={<TransferWithinAStationIcon />}
                      color="warning" // Orange Transfer Button
                      onClick={() => handleOpenTransferDialog(nft)}
                    >
                      Transfer NFT
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" color="textSecondary" align="center">
                No NFTs Found
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
      <TransferDialog />
    </Box>
  );
};

export default NFTDashboard;
